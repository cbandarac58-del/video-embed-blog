import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Generic noise to exclude from tags ──────────────────────────────────────
const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','x-video','porn','video','videos',
  'hd','free','raw','mms','leak','leaked','bangbros','brazzers','pervcity',
  'houseofyre','xvid','xv','adult','xxx','sex','tube','watch','full',
  'scene','movie','clip','download','online','streaming','mofozo','com'
]);

// ─── Stepsister SEO Title Templates ──────────────────────────────────────────
const STEPSISTER_TITLES = [
  (k) => `Naughty Stepsister ${k} Begs To Get Fucked Hard`,
  (k) => `${k} Stepsister Catches Stepbro Watching – Then Joins In`,
  (k) => `Taboo Fantasy – Hot Stepsister ${k} Can't Resist Stepbrother`,
  (k) => `${k} Stepsis Needs A Big Cock Favor From Her Stepbro`,
  (k) => `Wild Stepsister ${k} – Secret Bedroom Fantasy Finally Revealed`,
  (k) => `${k} – Horny Stepsister Seduces Stepbrother Into Bed`,
  (k) => `Forbidden Stepsis ${k} – Taboo Late Night Bedroom Session`,
  (k) => `${k} Stepsister Agrees To A Deal She Can't Refuse`,
  (k) => `My Stepsister ${k} Walked In & Couldn't Keep Her Hands Off`,
  (k) => `${k} – Stepbro Finally Gets What Stepsis Has Been Teasing`,
  (k) => `Stepsis ${k} Caught Watching – Now She Has To Pay Up`,
  (k) => `${k} – Hot Stepsister Gives Stepbro The Best Surprise Ever`,
  (k) => `Petite Stepsister ${k} Takes Stepbro's Big Cock Like A Pro`,
  (k) => `${k} Stepsister Stuck & Stepbro Sees His Chance`,
  (k) => `Busty Stepsister ${k} Can't Stop Thinking About Stepbrother`,
  (k) => `${k} – Stepsister's Secret Crush Turns Into Wild Taboo Fuck`,
  (k) => `Real Taboo – Stepsister ${k} Finally Says Yes To Stepbro`,
  (k) => `${k} Stepsis Sneaks Into Stepbro's Room For Late Night Fun`,
  (k) => `Teen Stepsister ${k} Gets Her Tight Pussy Pounded By Stepbro`,
  (k) => `${k} – Naughty Stepsister Trades A Favor For Mind-Blowing Sex`,
];

// ─── Stepsister SEO Description Templates ────────────────────────────────────
const STEPSISTER_DESCS = [
  (k, title) => `Watch this incredible taboo video featuring ${title}. This naughty stepsister couldn't resist her stepbrother any longer and finally gave in to her forbidden desires. Hot, raw, and completely uncensored stepsister action with ${k} that you won't find anywhere else. Perfect for fans of taboo family roleplay and genuine amateur passion.`,
  (k, title) => `${title} – One of the hottest stepsister videos online right now. She walked in at the wrong time and things escalated fast. Watch as this sexy stepsis gets what she's been secretly craving from her stepbro. Real taboo energy, stunning body, and non-stop action from start to finish. Must-watch for stepsister fantasy lovers.`,
  (k, title) => `You won't believe how wild things get in this ${title} video. This gorgeous stepsister had been flirting for weeks and today stepbro finally made his move. Watch the full taboo encounter – from the first awkward moment to the explosive finish. Featuring ${k}, this is the kind of stepsister content that keeps you coming back for more.`,
  (k, title) => `This ${title} clip is pure taboo gold. Stepsis was trying to be sneaky but stepbro caught her red-handed and turned the situation into something neither of them will forget. Hot stepbrother and stepsister chemistry, passionate forbidden sex, and a finish that will blow your mind. Fan-favorite content for taboo fantasy enthusiasts.`,
  (k, title) => `Featuring ${k} in ${title} – this stepsister fantasy video is breaking records online. Watch as their forbidden attraction finally boils over into the hottest taboo sex session you've seen all year. Passionate, raw, and completely addictive viewing – this is exactly why stepsister videos dominate search results everywhere.`,
  (k, title) => `${title} delivers everything you want in a top-tier stepsister video. She's hot, he's ready, and the tension between them has been building for days. Once stepbro made his move, there was no stopping what came next. Real taboo roleplay energy with ${k} that feels completely authentic and wildly satisfying.`,
  (k, title) => `Get ready for ${title} – the stepsister encounter you've been searching for. This gorgeous stepsis had always been off-limits but today the rules went right out the window. Watch their forbidden chemistry explode into the rawest, most satisfying taboo sex scene online. ${k} content at its absolute best.`,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function extractKeyword(rawTitle) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|naughty|america|pervcity|houseofyre|promo|official|enter|free|download|watch|mofozo|com|step|sister|brother|stepsister|stepbrother|stepbro|stepsis|porn|sex|fuck|fucking|video|xxx|bro|sis)\b/gi;
  let cleaned = rawTitle
    .replace(/\s*[-|–]\s*(xvideos|hd|free|full movie).*$/i, '')
    .replace(noisy, '')
    .replace(/[_\-#@!]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(w => w.length > 1);
  if (words.length === 0) return 'Beauty';
  return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function buildSEOTags(keywords) {
  const baseTags = ['stepsister', 'taboo', 'stepbrother', 'teen', 'petite', 'family-taboo', 'step-sister', 'step-bro'];

  const fromKeywords = (keywords || '').split(',')
    .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(k =>
      k.length > 2 &&
      !EXCLUDE_TAGS.has(k) &&
      !/\d{4}/.test(k) &&
      !k.includes('xvideos') &&
      !k.includes('www-')
    )
    .slice(0, 5);

  const merged = [...new Set([...baseTags, ...fromKeywords])].slice(0, 10);
  return merged;
}

function getRandomViews() {
  const opts = ['280K','410K','560K','720K','890K','1.1M','1.5M','2.0M','2.6M','3.2M','4.1M'];
  return opts[Math.floor(Math.random() * opts.length)];
}
function getRandomRating() { return Math.floor(Math.random() * 9) + 87; }

function getRandomDate() {
  // Random date between 2025-01-01 and 2026-06-01
  const start = new Date('2025-01-01').getTime();
  const end = new Date('2026-06-01').getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().split('T')[0];
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const rawPath = path.resolve(__dirname, '../src/content/videos/raw_stepsister_500.json');
  const dbPath  = path.resolve(__dirname, '../src/content/videos/database.json');

  const rawVideos = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
  const existing  = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const existingSlugs  = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  console.log(`📦 Existing videos in DB: ${existing.length}`);
  console.log(`📋 Raw stepsister videos to process: ${rawVideos.length}\n`);

  const newEntries = [];
  let skipped = 0;

  for (let i = 0; i < rawVideos.length; i++) {
    const raw = rawVideos[i];

    // Skip duplicates
    if (existingEmbeds.has(raw.embedUrl)) {
      process.stdout.write(`[${i+1}/${rawVideos.length}] ⏭️  Duplicate – ${raw.id}\n`);
      skipped++;
      continue;
    }

    const keyword = extractKeyword(raw.rawTitle || '');

    // Pick random title template
    const titleTpl = STEPSISTER_TITLES[Math.floor(Math.random() * STEPSISTER_TITLES.length)];
    const title = titleTpl(keyword);

    // Pick random description template
    const descTpl = STEPSISTER_DESCS[Math.floor(Math.random() * STEPSISTER_DESCS.length)];
    const description = descTpl(keyword, title);

    const tags = buildSEOTags(raw.keywords || '');

    let slug = slugify(title).slice(0, 90);
    let attempt = 1;
    while (existingSlugs.has(slug)) slug = `${slugify(title).slice(0, 80)}-${attempt++}`;
    existingSlugs.add(slug);
    existingEmbeds.add(raw.embedUrl);

    const entry = {
      title,
      slug,
      description,
      embedUrl: raw.embedUrl,
      thumbnailUrl: raw.thumbnailUrl || '',
      tags,
      category: 'stepsister',
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: getRandomDate(),
    };

    newEntries.push(entry);
    process.stdout.write(`[${i+1}/${rawVideos.length}] ✅ "${title.slice(0, 70)}"\n`);
  }

  if (newEntries.length === 0) {
    console.log('\n⚠️  No new videos to add. All were duplicates.');
    return;
  }

  // Prepend new entries (newest first)
  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');

  console.log(`\n✅ Done! Added ${newEntries.length} new stepsister videos.`);
  console.log(`⏭️  Skipped ${skipped} duplicates.`);
  console.log(`📦 Total videos in DB: ${updated.length}`);
}

main().catch(e => console.error('❌ Error:', e.message));
