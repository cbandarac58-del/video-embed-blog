/**
 * add_asian_xvideos.js
 * Scrapes 500 videos from XVideos Asian Woman category (multi-page).
 * Run: node scripts/add_asian_xvideos.js
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_CATEGORY_URL = 'https://www.xvideos.com/c/Asian_Woman-32';
const TARGET_COUNT = 500;
const DB_PATH = path.resolve(__dirname, '../src/content/videos/database.json');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','porn','video','videos','hd','free',
  'raw','mms','leak','leaked','brazzers','adult','xxx','sex','tube','watch',
  'full','scene','movie','clip','download','online','streaming','xvid',
]);

// Asian Woman specific SEO templates
const SEO_TEMPLATES = [
  (k) => `${k} – Exotic Asian Beauty's Passionate Sex Scene`,
  (k) => `Hot ${k} Asian Babe Rides Hard Until She Cums`,
  (k) => `${k} – Japanese Cutie Gets Pounded Deep`,
  (k) => `Petite Asian ${k} Takes Big Cock In Tight Pussy`,
  (k) => `${k} – Gorgeous Asian Woman's Wild Sex Fantasy`,
  (k) => `Stunning ${k} Asian MILF Shows Her Naughty Side`,
  (k) => `${k} – Innocent Asian Teen's First Wild Experience`,
  (k) => `Sexy Asian ${k} Begs For Deep Hardcore Pounding`,
  (k) => `${k} – Beautiful Korean Babe's Secret Sex Tape`,
  (k) => `Amateur Asian ${k} Shows Off In Steamy Home Video`,
];

const ASIAN_TAGS_BASE = [
  'asian','asian-woman','asian-babe','asian-sex','asian-teen','asian-milf',
  'japanese','korean','chinese','thai','asian-amateur','asian-xxx',
  'exotic','petite-asian','asian-beauty','asian-porn','jav','tight-pussy',
  'asian-blowjob','asian-creampie',
];

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function extractVideoId(url) {
  // XVideos URL patterns:
  // /video.abc123def/title
  // /embedframe/abc123def
  const match = url.match(/\/video\.([a-z0-9]+)\//i) || url.match(/\/embedframe\/([a-z0-9]+)/i);
  return match ? match[1] : null;
}

function getRandomViews() {
  const opts = ['280K','380K','510K','640K','820K','1.1M','1.4M','1.9M','2.5M','3.1M'];
  return opts[Math.floor(Math.random() * opts.length)];
}

function getRandomRating() { return Math.floor(Math.random() * 8) + 88; }
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

function generateSEOTitle(rawTitle) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|free|full|official|enter|download|watch|asian-woman|asian|woman)\b/gi;
  let cleaned = rawTitle
    .replace(/\s*[-|–]\s*(xvideos|hd|free|full).*$/i, '')
    .replace(noisy, '')
    .replace(/[_\-#@!]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ').filter(w => w.length > 1);
  const keyword = words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const tpl = SEO_TEMPLATES[Math.floor(Math.random() * SEO_TEMPLATES.length)];
  return tpl(keyword || 'Asian Beauty');
}

function buildSEOTags(rawKeywords, videoTitle) {
  const fromMeta = rawKeywords.split(',')
    .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(k => k.length > 2 && !EXCLUDE_TAGS.has(k) && !/\d{4}/.test(k))
    .slice(0, 8);

  const titleWords = videoTitle.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(w => w.length > 3 && !EXCLUDE_TAGS.has(w))
    .map(w => w.replace(/\s+/g, '-'))
    .slice(0, 4);

  const merged = [...new Set([...fromMeta, ...titleWords, ...ASIAN_TAGS_BASE])];
  return merged.slice(0, 20);
}

function generateDescription(title, tags) {
  const tagStr = tags.slice(0, 4).join(', ');
  const templates = [
    `Watch this stunning Asian woman in an explicit sex video featuring ${title.slice(0, 40)}. This beautiful exotic beauty delivers passionate action. Perfect for fans of Asian porn, Japanese sex videos, Korean adult content, and petite Asian girl explicit scenes. Stream free HD now.`,
    `Beautiful Asian woman in this incredible explicit video. Petite exotic beauty takes big cock with enthusiasm and natural moaning. Ideal for fans of Asian sex, Japanese adult content, Korean porn, Thai beauties, and Chinese girl explicit videos. Watch this hot Asian woman scene free online in HD quality.`,
    `Gorgeous Asian babe delivers stunning performance in this explicit ${tagStr} video. This petite Asian woman's natural beauty and passionate sex drive make every second worth watching. Perfect for Asian porn lovers, JAV enthusiasts, Korean adult content fans, and exotic beauty video seekers online.`,
  ];
  const hash = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return templates[hash % templates.length];
}

// ─── Fetch one category page and extract video URLs ───────────────────────────
async function fetchCategoryPage(pageUrl) {
  try {
    const { data } = await axios.get(pageUrl, { timeout: 20000, headers: HEADERS });
    const $ = cheerio.load(data);
    const urls = [];

    // Method 1: anchor tags with /video. pattern
    $('a[href*="/video."]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && /\/video\.[a-z0-9]+\//i.test(href)) {
        const abs = href.startsWith('/') ? 'https://www.xvideos.com' + href : href;
        if (!urls.includes(abs)) urls.push(abs);
      }
    });

    // Method 2: try data-videourl attributes
    $('[data-videourl]').each((_, el) => {
      const url = $(el).attr('data-videourl');
      if (url && !urls.includes(url)) urls.push(url);
    });

    console.log(`  📄 Found ${urls.length} video URLs on ${pageUrl}`);
    return urls;
  } catch (err) {
    console.log(`  ❌ Failed to fetch ${pageUrl}: ${err.message}`);
    return [];
  }
}

// ─── Fetch individual video metadata ─────────────────────────────────────────
async function fetchVideoMeta(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  try {
    const { data } = await axios.get(url, { timeout: 15000, headers: HEADERS });
    const $ = cheerio.load(data);

    let rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';
    const rawKeywords = $('meta[name="keywords"]').attr('content') || '';

    // Fallback title from URL
    if (!rawTitle || rawTitle.toLowerCase().includes('xvideos.com')) {
      const parts = url.split('/');
      rawTitle = (parts[parts.length - 1] || parts[parts.length - 2] || '')
        .replace(/[_\-]+/g, ' ').replace(/\.[a-z]+$/, '');
    }

    const title = generateSEOTitle(rawTitle);
    const tags = buildSEOTags(rawKeywords, rawTitle);
    const description = generateDescription(title, tags);
    const slug = slugify(title).slice(0, 90);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    return {
      title,
      slug,
      embedUrl,
      thumbnailUrl: thumbnail,
      description,
      tags,
      category: 'Asian',
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
  } catch (err) {
    return null;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌏 Asian Woman XVideos Scraper Starting...');
  console.log(`🎯 Target: ${TARGET_COUNT} videos\n`);

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const existingSlugs = new Set(db.map(v => v.slug));
  const existingEmbeds = new Set(db.map(v => v.embedUrl));
  console.log(`📦 Existing videos: ${db.length}`);

  // Collect video URLs from multiple pages
  const allVideoUrls = [];
  let page = 0;

  while (allVideoUrls.length < TARGET_COUNT * 2 && page < 25) {
    // XVideos category pagination: page 0 = base URL, page N = base/N
    const pageUrl = page === 0 ? BASE_CATEGORY_URL : `${BASE_CATEGORY_URL}/${page}`;
    console.log(`\n📖 Fetching category page ${page + 1}...`);

    const urls = await fetchCategoryPage(pageUrl);
    const newUrls = urls.filter(u => {
      const id = extractVideoId(u);
      if (!id) return false;
      const embed = `https://www.xvideos.com/embedframe/${id}`;
      return !existingEmbeds.has(embed) && !allVideoUrls.includes(u);
    });

    allVideoUrls.push(...newUrls);
    console.log(`  ✅ Total collected: ${allVideoUrls.length} unique URLs`);

    if (urls.length === 0) {
      console.log('  ⚠️  No more pages available.');
      break;
    }

    page++;
    await sleep(1500); // Respectful delay between page fetches
  }

  console.log(`\n🔍 Processing ${Math.min(allVideoUrls.length, TARGET_COUNT)} videos...\n`);

  const newEntries = [];
  const toProcess = allVideoUrls.slice(0, TARGET_COUNT);

  for (let i = 0; i < toProcess.length; i++) {
    const url = toProcess[i];
    process.stdout.write(`[${i + 1}/${toProcess.length}] Fetching metadata... `);

    const meta = await fetchVideoMeta(url);
    if (!meta) {
      console.log('❌ Failed');
      continue;
    }

    // Ensure unique slug
    let finalSlug = meta.slug;
    let attempt = 1;
    while (existingSlugs.has(finalSlug)) finalSlug = `${meta.slug}-${attempt++}`;
    meta.slug = finalSlug;
    existingSlugs.add(finalSlug);
    existingEmbeds.add(meta.embedUrl);

    newEntries.push(meta);
    console.log(`✅ [${meta.category}] "${meta.title.slice(0, 55)}..."`);

    // Polite delay to avoid rate limiting
    await sleep(700);

    // Save checkpoint every 50 videos
    if (newEntries.length % 50 === 0) {
      const checkpoint = [...newEntries, ...db];
      fs.writeFileSync(DB_PATH, JSON.stringify(checkpoint, null, 2), 'utf-8');
      console.log(`\n💾 Checkpoint saved: ${newEntries.length} new videos so far\n`);
    }
  }

  if (newEntries.length === 0) {
    console.log('\n⚠️  No new videos added.');
    return;
  }

  // Final save: new videos at the top
  const finalDb = [...newEntries, ...db];
  fs.writeFileSync(DB_PATH, JSON.stringify(finalDb, null, 2), 'utf-8');

  console.log(`\n✅ Done! Added ${newEntries.length} Asian Woman videos`);
  console.log(`📦 Total database size: ${finalDb.length} videos`);
  console.log('\n🏃 Run "npm run build" and "git push" to deploy!\n');
}

main().catch(e => console.error('❌ Fatal error:', e.message));
