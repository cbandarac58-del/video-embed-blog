/**
 * mega_keyword_scraper.js
 * Scrapes 5 high-traffic keyword categories from XVideos:
 *   - Stepsister (500)
 *   - Indian/Desi (500)
 *   - Asian Creampie (300)
 *   - Doctor/Gyno (300)
 *   - Big Ass MILF (300)
 * Total: ~1900 new videos
 * Run: node scripts/mega_keyword_scraper.js
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '../src/content/videos/database.json');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','porn','video','videos','hd','free',
  'raw','mms','leak','leaked','brazzers','adult','xxx','sex','tube','watch',
  'full','scene','movie','clip','download','online','streaming','xvid',
]);

// ─── Category Configs ────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Doctor / Gyno',
    label: 'Doctor / Gyno',
    url: 'https://www.xvideos.com/tags/gyno',
    target: 300,
    seoTemplates: [
      (k) => `${k} – Gyno X Full Video Online Watching`,
      (k) => `Doctor ${k} – Naughty Gyno Exam Turns Into Wild Sex`,
      (k) => `${k} Gyno Clinic – Pervert Doctor Fucks His Patient`,
      (k) => `${k} – All Gyno X Full Videos Online Free Streaming`,
      (k) => `Naughty Nurse ${k} – Doctor Patient Taboo Fantasy`,
      (k) => `${k} – Gyno X Clinic Wild Examination Room Sex`,
    ],
    baseTags: ['gyno','doctor','gyno-x','gyno-exam','doctor-sex','nurse','clinic','patient',
               'gyno-x-full-videos','medical-fetish','gyno-fuck','doctor-patient','uniform',
               'gyno-clinic','pervert-doctor','naughty-nurse','medical-porn','hospital-sex',
               'gyno-porn','doctor-fucks-patient'],
    descTemplates: [
      (t) => `Naughty doctor turns gyno exam into wild sex session in this explicit gyno X video. This pervert doctor can't resist his hot patient during the private examination. Fans of gyno X full videos online watching, doctor patient porn, nurse sex tapes, and medical fantasy adult content will love this.`,
      (t) => `Watch ${t} in this hot gyno X clinic video. Naughty doctor performs intimate examination that turns into wild explicit sex. Perfect for gyno X full videos online watching fans, doctor patient taboo porn, nurse sex content seekers, medical fetish enthusiasts, and clinic fantasy adult streaming.`,
      (t) => `Hot gyno examination turns into passionate sex in this explicit doctor video. This naughty clinic scene delivers medical fantasy at its finest. Ideal for fans of gyno X all full videos online watching, doctor patient porn, pervert doctor sex tapes, nurse uniform content, and medical adult streaming.`,
    ],
  },
  {
    name: 'MILF',
    label: 'MILF',
    url: 'https://www.xvideos.com/tags/milf',
    target: 300,
    seoTemplates: [
      (k) => `${k} – Porn Butt MILF Takes Big Cock Doggy`,
      (k) => `Horny MILF ${k} – Big Ass Mature Beauty Fucked Hard`,
      (k) => `${k} Big Butt MILF – Can't Get Enough Rough Doggystyle`,
      (k) => `${k} – Hot MILF Butt Porn 2026 Real Amateur`,
      (k) => `Busty ${k} MILF – Massive Ass Takes Deep Pounding`,
      (k) => `${k} – Sexy MILF With Big Butt Loves Doggystyle Fucking`,
    ],
    baseTags: ['milf','big-ass-milf','milf-butt','porn-butt-milf','mature','stepmom',
               'big-butt','milf-doggystyle','busty-milf','milf-big-ass','cougar',
               'mature-big-ass','milf-creampie','milf-anal','milf-pov','hot-milf',
               'sexy-milf','milf-homemade','milf-2026','big-ass-mature'],
    descTemplates: [
      (t) => `Sexy MILF with massive ass gets fucked hard doggy style in this explicit porn butt MILF video. This busty mature beauty takes big cock deep from behind with wild moaning. Fans of porn butt MILF videos, big ass mature sex, MILF doggystyle porn, and busty cougar adult content will love this.`,
      (t) => `Hot MILF butt porn featuring ${t} showing off her massive curves before getting pounded hard. This busty mature goddess delivers explosive doggystyle action. Perfect for porn butt MILF fans, big ass mature sex video seekers, MILF anal and doggystyle enthusiasts, and hot cougar adult streaming.`,
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function extractVideoId(url) {
  const match = url.match(/\/video\.([a-z0-9]+)\//i);
  return match ? match[1] : null;
}

function getRandomViews(cat) {
  const opts = cat === 'Indian'
    ? ['180K','250K','380K','520K','710K','940K','1.3M','1.8M','2.4M','3.2M']
    : ['290K','410K','560K','730K','890K','1.1M','1.5M','2.0M','2.7M','3.5M'];
  return opts[Math.floor(Math.random() * opts.length)];
}

function getRandomRating() { return Math.floor(Math.random() * 9) + 87; }
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

function generateTitle(rawTitle, catConfig) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|free|full|official|porn|xxx|sex|video|tube)\b/gi;
  let cleaned = rawTitle
    .replace(/\s*[-|–]\s*(xvideos|hd|free|full|official).*$/i, '')
    .replace(noisy, '')
    .replace(/[_\-#@!]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ').filter(w => w.length > 1);
  const keyword = words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const tpl = catConfig.seoTemplates[Math.floor(Math.random() * catConfig.seoTemplates.length)];
  return tpl(keyword || catConfig.label + ' Beauty');
}

function buildTags(rawKeywords, rawTitle, catConfig) {
  const fromMeta = rawKeywords.split(',')
    .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(k => k.length > 2 && !EXCLUDE_TAGS.has(k) && !/\d{4}/.test(k) && /^[\x00-\x7F]+$/.test(k))
    .slice(0, 6);

  const titleWords = rawTitle.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(w => w.length > 3 && !EXCLUDE_TAGS.has(w))
    .slice(0, 3);

  const merged = [...new Set([...fromMeta, ...titleWords, ...catConfig.baseTags])];
  return merged.slice(0, 20);
}

function generateDesc(title, catConfig) {
  const templates = catConfig.descTemplates;
  const hash = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return templates[hash % templates.length](title.slice(0, 45));
}

// ─── Fetch category page URLs ──────────────────────────────────────────────────
async function fetchCategoryPage(pageUrl) {
  try {
    const { data } = await axios.get(pageUrl, { timeout: 20000, headers: HEADERS });
    const $ = cheerio.load(data);
    const urls = [];
    $('a[href*="/video."]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && /\/video\.[a-z0-9]+\//i.test(href)) {
        const abs = href.startsWith('/') ? 'https://www.xvideos.com' + href : href;
        if (!urls.includes(abs)) urls.push(abs);
      }
    });
    return urls;
  } catch (err) {
    console.log(`  ❌ Page fetch failed: ${err.message}`);
    return [];
  }
}

// ─── Fetch individual video metadata ──────────────────────────────────────────
async function fetchVideoMeta(url, catConfig) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;
  try {
    const { data } = await axios.get(url, { timeout: 15000, headers: HEADERS });
    const $ = cheerio.load(data);
    let rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';
    const rawKeywords = $('meta[name="keywords"]').attr('content') || '';

    if (!rawTitle || rawTitle.toLowerCase().includes('xvideos.com')) {
      const parts = url.split('/');
      rawTitle = (parts[parts.length - 1] || '').replace(/[_\-]+/g, ' ').replace(/\.[a-z]+$/, '');
    }

    const title = generateTitle(rawTitle, catConfig);
    const tags = buildTags(rawKeywords, rawTitle, catConfig);
    const description = generateDesc(title, catConfig);
    const slug = slugify(title).slice(0, 90);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    return {
      title, slug, embedUrl, thumbnailUrl: thumbnail, description, tags,
      category: catConfig.label,
      rating: getRandomRating(),
      views: getRandomViews(catConfig.name),
      dateAdded: new Date().toISOString().split('T')[0],
    };
  } catch (err) {
    return null;
  }
}

// ─── Scrape one category ────────────────────────────────────────────────────────
async function scrapeCategory(catConfig, existingSlugs, existingEmbeds) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🎯 Category: ${catConfig.label} | Target: ${catConfig.target} videos`);
  console.log(`🔗 URL: ${catConfig.url}`);
  console.log('═'.repeat(60));

  // Collect URLs from multiple pages
  const allUrls = [];
  let page = catConfig.startPage || 0;

  while (allUrls.length < catConfig.target * 2 && page < 50) {
    const pageUrl = page === 0 ? catConfig.url : `${catConfig.url}/${page}`;
    process.stdout.write(`  📖 Page ${page + 1}... `);
    const urls = await fetchCategoryPage(pageUrl);
    const newUrls = urls.filter(u => {
      const id = extractVideoId(u);
      if (!id) return false;
      const embed = `https://www.xvideos.com/embedframe/${id}`;
      return !existingEmbeds.has(embed) && !allUrls.includes(u);
    });
    allUrls.push(...newUrls);
    console.log(`${urls.length} found | ${allUrls.length} total unique`);
    if (urls.length === 0) break;
    page++;
    await sleep(1200);
  }

  console.log(`\n  🔍 Processing ${Math.min(allUrls.length, catConfig.target)} videos in batches...\n`);
  const newEntries = [];
  const toProcess = allUrls.slice(0, catConfig.target);
  const BATCH_SIZE = 5;
  let lastSavedCount = 0;

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    
    // Fetch batch concurrently
    const results = await Promise.all(
      batch.map(url => fetchVideoMeta(url, catConfig))
    );

    for (let j = 0; j < results.length; j++) {
      const meta = results[j];
      const currentIdx = i + j + 1;
      if (!meta) {
        console.log(`  [${currentIdx}/${toProcess.length}] ❌ Failed`);
        continue;
      }

      let finalSlug = meta.slug;
      let attempt = 1;
      while (existingSlugs.has(finalSlug)) finalSlug = `${meta.slug}-${attempt++}`;
      meta.slug = finalSlug;
      existingSlugs.add(finalSlug);
      existingEmbeds.add(meta.embedUrl);
      newEntries.push(meta);

      console.log(`  [${newEntries.length}/${toProcess.length}] ✅ "${meta.title.slice(0, 55)}..."`);
    }

    await sleep(600);

    // Save checkpoint every 100 videos added
    if (newEntries.length - lastSavedCount >= 100) {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      const newlyAddedSinceLast = newEntries.slice(lastSavedCount);
      const checkpoint = [...newlyAddedSinceLast, ...db];
      fs.writeFileSync(DB_PATH, JSON.stringify(checkpoint, null, 2), 'utf-8');
      lastSavedCount = newEntries.length;
      console.log(`\n  💾 Checkpoint: ${newEntries.length} ${catConfig.label} videos saved (total DB: ${checkpoint.length})\n`);
    }
  }

  console.log(`\n  ✅ ${catConfig.label} DONE: ${newEntries.length} videos added`);
  return newEntries;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 MEGA KEYWORD SCRAPER Starting...');
  console.log('📊 Targeting: Stepsister + Indian + Asian Creampie + Gyno + MILF\n');

  let db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const existingSlugs = new Set(db.map(v => v.slug));
  const existingEmbeds = new Set(db.map(v => v.embedUrl));
  console.log(`📦 Starting database size: ${db.length} videos`);

  let totalAdded = 0;

  for (const catConfig of CATEGORIES) {
    const newEntries = await scrapeCategory(catConfig, existingSlugs, existingEmbeds);

    if (newEntries.length > 0) {
      // Reload DB fresh to avoid overwriting checkpoint saves
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      
      // Remove any duplicates that might have been added via checkpoints
      const existingEmbedsInDb = new Set(db.map(v => v.embedUrl));
      const trulyNew = newEntries.filter(v => !existingEmbedsInDb.has(v.embedUrl));
      
      if (trulyNew.length > 0) {
        const updated = [...trulyNew, ...db];
        fs.writeFileSync(DB_PATH, JSON.stringify(updated, null, 2), 'utf-8');
        db = updated;
      }

      totalAdded += newEntries.length;
      console.log(`\n📦 DB size now: ${db.length} videos`);
    }

    // Delay between categories to avoid rate limiting
    console.log('\n⏳ Waiting 5 seconds before next category...\n');
    await sleep(5000);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 MEGA SCRAPER COMPLETE!');
  console.log(`✅ Total new videos added: ${totalAdded}`);
  console.log(`📦 Final database size: ${db.length} videos`);
  console.log('\n🏃 Now run: npm run build && git push');
  console.log('═'.repeat(60));
}

main().catch(e => console.error('❌ Fatal:', e.message));
