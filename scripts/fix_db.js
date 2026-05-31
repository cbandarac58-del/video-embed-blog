import { readFileSync, writeFileSync } from 'fs';

const dbPath = new URL('../src/content/videos/database.json', import.meta.url);
let db = JSON.parse(readFileSync(dbPath, 'utf8'));

console.log(`Loaded ${db.length} videos. Starting cleanup...`);

// ═══════════════════════════════════════════════════════════════════
// 1. NORMALIZE CATEGORY NAMES (fix case inconsistencies)
// ═══════════════════════════════════════════════════════════════════
const CAT_MAP = {
  'stepsister': 'Stepsister',
  'Stepsister': 'Stepsister',
  'asian': 'Asian',
  'Asian': 'Asian',
  'indian': 'Indian',
  'Indian': 'Indian',
  'milf': 'MILF',
  'MILF': 'MILF',
  'latina': 'Latina',
  'Latina': 'Latina',
  'anal': 'Anal',
  'Anal': 'Anal',
  'ebony': 'Ebony',
  'Ebony': 'Ebony',
  'teen': 'Teen',
  'Teen': 'Teen',
  'amateur': 'Amateur',
  'Amateur': 'Amateur',
  'hardcore': 'Hardcore',
  'Hardcore': 'Hardcore',
  'threesome': 'Threesome',
  'Threesome': 'Threesome',
  'massage': 'Massage',
  'Massage': 'Massage',
  'big-tits': 'Big Tits',
  'big-ass': 'Big Ass',
  'arab': 'Arab',
  'Arab': 'Arab',
  'lesbian': 'Lesbian',
  'Lesbian': 'Lesbian',
  'Doctor / Gyno': 'Doctor / Gyno',
  'Sri Lankan': 'Sri Lankan',
};

let catFixed = 0;
db = db.map(v => {
  const normalizedCat = CAT_MAP[v.category];
  if (normalizedCat && normalizedCat !== v.category) {
    catFixed++;
    return { ...v, category: normalizedCat };
  }
  return v;
});
console.log(`✓ Category names normalized: ${catFixed} fixed`);

// ═══════════════════════════════════════════════════════════════════
// 2. CLEAN GARBLED/DOUBLE TITLES
// Titles like "Amateur Asian [Domestic] Jelly Media Domestic Shows Off In Steamy Home"
// These have the original scraper title + an AI-appended SEO title joined together
// Pattern: real title part + a repeated keyword phrase
// Strategy: If title has repeated words / is suspiciously long, trim to first logical sentence
// ═══════════════════════════════════════════════════════════════════

function cleanTitle(title) {
  if (!title) return title;
  
  // Remove common scraper artifacts in brackets or parentheses at start
  // e.g. "[Domestic]", "(HD)", etc.
  let t = title.replace(/^\[.*?\]\s*/g, '').trim();
  
  // Detect and remove duplicated SEO appendages
  // Pattern: "Real Title – SEO Clickbait Title" — keep only the first part if it looks clean
  // Common separators used by the AI: " – ", " — ", " | "
  const sepMatch = t.match(/^(.+?)\s+[–—|]\s+(.+)$/);
  if (sepMatch) {
    const firstPart = sepMatch[1].trim();
    const secondPart = sepMatch[2].trim();
    
    // If first part is clean and not too short, prefer it
    if (firstPart.length >= 10 && firstPart.length <= 80) {
      t = firstPart;
    } else if (secondPart.length >= 10 && secondPart.length <= 80) {
      t = secondPart;
    }
  }
  
  // Detect doubled-up phrases: "word1 word2 word1 word2..." 
  // If the title seems to have repeating chunks, truncate at first repetition
  const words = t.split(/\s+/);
  if (words.length > 15) {
    // Check for repeated bigrams in the second half
    const firstHalf = words.slice(0, Math.floor(words.length / 2)).join(' ').toLowerCase();
    for (let i = 8; i < words.length - 2; i++) {
      const chunk = words.slice(i, i + 3).join(' ').toLowerCase();
      if (firstHalf.includes(chunk)) {
        t = words.slice(0, i).join(' ');
        break;
      }
    }
  }
  
  // Trim to max 100 chars at a word boundary
  if (t.length > 100) {
    t = t.substring(0, 100).replace(/\s+\S*$/, '').trim();
  }
  
  return t.trim();
}

let titleFixed = 0;
db = db.map(v => {
  const cleaned = cleanTitle(v.title);
  if (cleaned !== v.title) {
    titleFixed++;
    return { ...v, title: cleaned };
  }
  return v;
});
console.log(`✓ Titles cleaned: ${titleFixed} fixed`);

// ═══════════════════════════════════════════════════════════════════
// 3. FIX DESCRIPTION TEMPLATES — Replace repeated/generic descriptions
// with ones that actually mention the video title
// ═══════════════════════════════════════════════════════════════════

const genericDescPatterns = [
  'Beautiful Asian woman in this incredible explicit video',
  'Gorgeous Asian babe delivers stunning performance',
  'Watch this stunning Asian woman in an explicit sex video',
  'Beautiful Indian woman stars in this incredible',
  'Watch this stunning Indian woman in an explicit',
  'Watch this incredible Stepsister video featuring',
  'Experience the ultimate MILF fantasy',
  'Watch this incredible MILF video',
  'Watch this incredible Doctor',
  'Experience the ultimate doctor',
];

function isGenericDescription(desc) {
  if (!desc) return true;
  return genericDescPatterns.some(pattern => desc.includes(pattern));
}

function generateDescription(video) {
  const { title, category, tags } = video;
  const topTags = (tags || []).filter(t => t !== 'x-video').slice(0, 3).join(', ');
  
  const catDescriptions = {
    'Stepsister': [
      `Watch ${title} — a hot stepsister fantasy video with ${topTags || 'explicit action'}. Free HD stream.`,
      `${title} is a must-watch stepsister scene with passionate ${topTags || 'action'}. Watch free online.`,
      `Enjoy this sizzling stepsister video: ${title}. Featuring ${topTags || 'hardcore content'} in HD quality.`,
    ],
    'Asian': [
      `${title} — beautiful Asian woman in a passionate and explicit scene with ${topTags || 'hardcore action'}. Free HD.`,
      `Watch ${title}: stunning Asian beauty in an intense video featuring ${topTags || 'explicit content'}. Stream free.`,
      `Enjoy ${title} — a gorgeous Asian performer in a wild scene with ${topTags || 'passionate action'}. Free online.`,
    ],
    'Indian': [
      `${title} — hot Indian woman stars in this explicit desi scene with ${topTags || 'passionate action'}. Free HD stream.`,
      `Watch ${title}: beautiful Indian babe in a steamy video featuring ${topTags || 'hardcore content'}. Stream free.`,
      `Enjoy this desi fantasy: ${title}. Features a gorgeous Indian woman with ${topTags || 'explicit action'}. Free HD.`,
    ],
    'MILF': [
      `${title} — a sexy MILF in an intense and passionate scene with ${topTags || 'explicit action'}. Free HD stream.`,
      `Watch ${title}: experienced MILF in a steamy video featuring ${topTags || 'hardcore content'}. Stream free online.`,
      `Enjoy this MILF fantasy: ${title}. Gorgeous older woman with ${topTags || 'passionate action'}. Free HD.`,
    ],
    'Doctor / Gyno': [
      `${title} — a naughty doctor/gyno fantasy with ${topTags || 'explicit scenes'}. Watch free HD online.`,
      `Watch ${title}: a steamy medical role-play scene featuring ${topTags || 'passionate action'}. Free stream.`,
      `Enjoy ${title} — an explicit doctor fantasy video with ${topTags || 'hardcore content'}. Free HD stream.`,
    ],
  };
  
  const defaults = [
    `Watch ${title} — an explicit ${category} video with ${topTags || 'hardcore action'}. Free HD stream online.`,
    `Enjoy ${title}: a hot ${category} scene featuring ${topTags || 'explicit content'}. Stream free in HD.`,
    `${title} is a must-watch ${category} video with ${topTags || 'passionate action'}. Watch free online now.`,
  ];
  
  const pool = catDescriptions[category] || defaults;
  // Pick based on slug hash for variety
  const hash = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

let descFixed = 0;
db = db.map(v => {
  if (isGenericDescription(v.description)) {
    descFixed++;
    return { ...v, description: generateDescription(v) };
  }
  return v;
});
console.log(`✓ Generic descriptions replaced: ${descFixed} fixed`);

// ═══════════════════════════════════════════════════════════════════
// 4. REMOVE DUPLICATE x-video TAGS (present in almost every entry)
// Keep only content-relevant tags
// ═══════════════════════════════════════════════════════════════════
let tagsFixed = 0;
db = db.map(v => {
  const tags = (v.tags || []);
  // Count x-video occurrences
  const xvideoCount = tags.filter(t => t === 'x-video').length;
  if (xvideoCount > 1) {
    tagsFixed++;
    // Remove all but one x-video
    let removed = 0;
    const newTags = tags.filter(t => {
      if (t === 'x-video' && removed < xvideoCount - 1) {
        removed++;
        return false;
      }
      return true;
    });
    return { ...v, tags: newTags };
  }
  return v;
});
console.log(`✓ Duplicate tags cleaned: ${tagsFixed} videos`);

// ═══════════════════════════════════════════════════════════════════
// 5. FINAL STATS
// ═══════════════════════════════════════════════════════════════════
const finalCats = {};
db.forEach(v => { finalCats[v.category] = (finalCats[v.category] || 0) + 1; });
console.log('\n=== FINAL CATEGORY DISTRIBUTION ===');
console.log(JSON.stringify(finalCats, null, 2));
console.log('Total videos:', db.length);

// Write back
writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('\n✅ database.json saved successfully!');
