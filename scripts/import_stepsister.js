import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Generic keywords to exclude from tags ────────────────────────────────────
const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','x-video','porn','video','videos',
  'hd','free','raw','mms','leak','leaked','bangbros','brazzers','pervcity',
  'houseofyre','xvid','xv','adult','xxx','sex','tube','watch','full',
  'scene','movie','clip','download','online','streaming'
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
];

// ─── Stepsister SEO Description Templates ────────────────────────────────────
const STEPSISTER_DESCS = [
  (k, title) => `Watch this incredible taboo video featuring ${title}. This naughty stepsister couldn't resist her stepbrother any longer and finally gave in to her forbidden desires. Hot, raw, and completely uncensored stepsister action with ${k} that you won't find anywhere else.`,
  (k, title) => `${title} – One of the hottest stepsister videos online right now. She walked in at the wrong time and things escalated fast. Watch as this sexy stepsis gets what she's been secretly craving from her stepbro. Real taboo energy and non-stop action.`,
  (k, title) => `You won't believe how wild things get in this ${title} video. This gorgeous stepsister had been flirting for weeks and today stepbro finally made his move. Watch the full taboo encounter featuring ${k}.`,
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
      !k.includes('xvideos')
    )
    .slice(0, 4);

  return [...new Set([...baseTags, ...fromKeywords])].slice(0, 8);
}

function getRandomViews() {
  const opts = ['280K','410K','560K','720K','890K','1.1M','1.5M','2.0M','2.6M','3.2M','4.1M'];
  return opts[Math.floor(Math.random() * opts.length)];
}

function getRandomRating() { return Math.floor(Math.random() * 9) + 87; }

// ─── XVideos Scraper Function (500 Limit) ────────────────────────────────────
async function scrapeStepsisterVideos(targetLimit = 500) {
  console.log(`🌐 Fetching ${targetLimit} Stepsister videos from XVideos API...`);
  const scraped = [];
  let page = 0;

  while (scraped.length < targetLimit && page < 30) {
    try {
      const url = `https://www.xvideos.com/api/videosearch/v3?k=stepsister&p=${page}&sort=relevance`;
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });

      const videos = res.data?.videos || [];
      if (videos.length === 0) break;

      for (const v of videos) {
        if (!v.id) continue;
        scraped.push({
          rawTitle: v.tf || v.t || 'Hot Stepsister',
          embedUrl: `https://www.xvideos.com/embedframe/${v.id}`,
          thumbnailUrl: v.u || v.i || '',
          keywords: v.k ? v.k.join(',') : ''
        });
        if (scraped.length >= targetLimit) break;
      }
      page++;
    } catch (e) {
      console.error(`❌ Page ${page} Fetch Error:`, e.message);
      break;
    }
  }
  return scraped;
}

// ─── Main Execution ──────────────────────────────────────────────────────────
async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const existingSlugs = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  console.log(`📦 Existing videos in DB: ${existing.length}`);

  // Fetch 500 Stepsister videos
  const rawVideos = await scrapeStepsisterVideos(500);
  console.log(`📋 Fetched ${rawVideos.length} stepsister videos to process.\n`);

  const newEntries = [];
  let skipped = 0;

  for (let i = 0; i < rawVideos.length; i++) {
    const raw = rawVideos[i];

    if (existingEmbeds.has(raw.embedUrl)) {
      skipped++;
      continue;
    }

    const keyword = extractKeyword(raw.rawTitle || '');

    const titleTpl = STEPSISTER_TITLES[Math.floor(Math.random() * STEPSISTER_TITLES.length)];
    const title = titleTpl(keyword);

    const descTpl = STEPSISTER_DESCS[Math.floor(Math.random() * STEPSISTER_DESCS.length)];
    const description = descTpl(keyword, title);

    const tags = buildSEOTags(raw.keywords || '');

    let slug = slugify(title).slice(0, 90);
    let attempt = 1;
    while (existingSlugs.has(slug)) slug = `${slugify(title).slice(0, 80)}-${attempt++}`;
    
    existingSlugs.add(slug);
    existingEmbeds.add(raw.embedUrl);

    newEntries.push({
      title,
      slug,
      description,
      embedUrl: raw.embedUrl,
      thumbnailUrl: raw.thumbnailUrl,
      tags,
      category: 'stepsister',
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: new Date().toISOString().split('T')[0],
    });
  }

  if (newEntries.length === 0) {
    console.log('\n⚠️ No new videos added. All were duplicates.');
    return;
  }

  // Prepend new videos
  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');

  console.log(`\n✅ Done! Added ${newEntries.length} new stepsister videos.`);
  console.log(`⏭️ Skipped ${skipped} duplicates.`);
  console.log(`📦 Total DB Videos: ${updated.length}`);

  // Trigger IndexNow Script if exists
  console.log('\n🚀 Triggering IndexNow to notify search engines...');
  exec('node scripts/indexnow.js', (err, stdout) => {
    if (!err && stdout) console.log(stdout.trim());
  });

  // Fix thumbnails
  console.log('🖼️ Running thumbnail fix...');
  exec('node scripts/fix_thumbnails.js', (err, stdout) => {
    if (!err && stdout) console.log(stdout.trim());
  });
}

main().catch(e => console.error('Error:', e.message));
