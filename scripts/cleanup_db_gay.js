import { readFileSync, writeFileSync } from 'fs';

const dbPath = new URL('../src/content/videos/database.json', import.meta.url);
let db = JSON.parse(readFileSync(dbPath, 'utf8'));

console.log(`Loaded ${db.length} videos. Starting Gay category cleanup...`);

const keywords = ['gay', 'twink', 'blacksonboys', 'barebacking', 'male-on-male', 'gay-porn', 'gay-dick', 'gay-facial', 'homo', 'homosexual', 'homorooms', 'gaywire', 'bisexual', 'gaysex', 'men-on-men', 'manroyale'];
let count = 0;

function cleanTitle(title) {
  let t = title;
  
  // Remove noise prefixes/suffixes
  t = t.replace(/New Indian Sex/gi, '');
  t = t.replace(/Indian MMS/gi, '');
  t = t.replace(/Desi Romance/gi, '');
  t = t.replace(/Desi/gi, '');
  t = t.replace(/Indian Mom/gi, '');
  t = t.replace(/Hot Indian/gi, '');
  t = t.replace(/Indian/gi, '');
  t = t.replace(/Ki Chudai/gi, '');
  t = t.replace(/MMS/gi, '');
  t = t.replace(/Romance/gi, '');
  
  // Clean up punctuation and spacing
  t = t.replace(/[\(\),\-\:\"]/g, ' ');
  t = t.replace(/\s+/g, ' ');
  t = t.trim();

  // Strip trailing noise words
  const noisePattern = /\s+(and|in|on|of|for|to|with|the|a|is|at)$/i;
  while (noisePattern.test(t)) {
    t = t.replace(noisePattern, '');
  }

  // Title capitalization (preserving 's)
  t = t.split(' ').map(w => {
    if (!w) return '';
    if (w.includes("'")) {
      return w.split("'").map((sub, i) => {
        if (i > 0 && sub.toLowerCase() === 's') return 's';
        return sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase();
      }).join("'");
    }
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
  
  return t;
}

function cleanTags(tags) {
  const spam = ['desi', 'indian', 'hindi', 'indian-sex', 'indian-babe', 'desi-porn', 'hindi-audio', 'indian-homemade', 'desi-xxx', 'indian-wife', 'bhabhi', 'indian-mms', 'mom', 'milf', 'stepsister', 'stepmom', 'stepbrother', 'sister', 'brother'];
  return (tags || []).filter(t => !spam.includes(t.toLowerCase().trim()));
}

db = db.map(v => {
  if ((v.category || '').toLowerCase() === 'indian') {
    const text = `${v.title} ${v.description || ''} ${(v.tags || []).join(' ')}`.toLowerCase();
    const matched = keywords.filter(kw => text.includes(kw));
    if (matched.length > 0) {
      count++;
      
      const newTitle = cleanTitle(v.title);
      const newTags = cleanTags(v.tags);
      const newDesc = `Watch ${newTitle} on VixTube. This premium gay video features hot performers in an intense, high-quality stream. Explore top tags like ${newTags.slice(0, 5).join(', ')} for more scenes.`;
      
      // Slugify new title
      const newSlug = newTitle.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

      return {
        ...v,
        title: newTitle,
        slug: newSlug,
        tags: newTags,
        description: newDesc,
        category: 'Gay'
      };
    }
  }
  return v;
});

console.log(`Cleaned up ${count} gay videos in Indian category.`);

writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Database updated successfully!');
