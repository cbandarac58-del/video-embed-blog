import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEARCH_URL = 'https://www.pornhub.com/video/search?search=sri+lankan+girl+sex+video+download&page=1';
const DELAY_MS = 800;

const EXCLUDE_KEYWORDS = new Set([
  'pornhub','porn','video','videos','hd','free','sex','watch','full',
  'scene','clip','download','online','streaming','xxx','tube','adult'
]);

const CATEGORY_MAP = [
  { keys: ['sri-lankan','srilanka','sri-lanka','lanka','ceylon','sinhala','lochi','shaakya'], cat: 'Indian' },
  { keys: ['indian','desi','hindi','bhabhi','malkin','desi-sex'], cat: 'Indian' },
  { keys: ['stepsister','step-sister','stepsis','stepsiblings','stepdaughter'], cat: 'stepsister' },
  { keys: ['stepmom','step-mom','milf','mature','stepmother'], cat: 'MILF' },
  { keys: ['amateur','homemade','real','leaked','mms'], cat: 'amateur' },
  { keys: ['teen','teenager','18','young','college'], cat: 'teen' },
  { keys: ['anal','anal-sex'], cat: 'anal' },
  { keys: ['asian','japanese','korean','thai'], cat: 'asian' },
  { keys: ['threesome','3some','gangbang','dp'], cat: 'threesome' },
  { keys: ['lesbian','girlsway'], cat: 'lesbian' },
];

const SRI_LANKAN_TITLES = [
  t => `Sri Lankan Hot Babe – ${t}`,
  t => `Ceylon Girl Exposed – ${t}`,
  t => `Sinhala Leaked MMS – ${t}`,
  t => `Sri Lankan Amateur – ${t}`,
  t => `Lanka Desi Babe – ${t}`,
];

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function detectCategory(tags) {
  for (const { keys, cat } of CATEGORY_MAP) {
    if (tags.some(t => keys.some(k => t.toLowerCase().includes(k)))) return cat;
  }
  return 'amateur';
}

function getRandomViews() {
  const options = ['150K','230K','310K','450K','580K','720K','910K','1.2M','1.5M','1.9M','2.4M'];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomRating() {
  return Math.floor(Math.random() * 10) + 88;
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function enhanceTitle(rawTitle, tags) {
  const clean = rawTitle
    .replace(/\s*[-|]\s*(pornhub|ph|xvideos|brazzers|bang bros).*$/i, '')
    .replace(/\s+/g, ' ').trim();

  // If the title already has Sri Lanka keywords, use it directly
  const lower = clean.toLowerCase();
  if (lower.includes('sri lanka') || lower.includes('sinhala') || lower.includes('ceylon') || lower.includes('lochi')) {
    return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // Otherwise use a Sri Lankan template
  const template = SRI_LANKAN_TITLES[Math.floor(Math.random() * SRI_LANKAN_TITLES.length)];
  return template(clean);
}

async function fetchVideoMeta(viewkey, rawTitle, thumbnailUrl) {
  const embedUrl = `https://www.pornhub.com/embed/${viewkey}`;
  
  try {
    // Fetch individual video page for tags/keywords
    const videoPageUrl = `https://www.pornhub.com/view_video.php?viewkey=${viewkey}`;
    const { data } = await axios.get(videoPageUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(data);

    // Extract tags from tagsWrapper
    const rawTags = [];
    $('div.tagsWrapper a, div.categoriesWrapper a').each((i, el) => {
      const tagText = $(el).text().trim().toLowerCase().replace(/\s+/g, '-');
      if (tagText.length > 2 && !EXCLUDE_KEYWORDS.has(tagText)) {
        rawTags.push(tagText);
      }
    });

    // Add sri-lankan tag
    if (!rawTags.includes('sri-lankan')) rawTags.unshift('sri-lankan');

    const tags = rawTags.slice(0, 8);
    const title = enhanceTitle(rawTitle, tags);
    const slug = slugify(title).slice(0, 80);
    const category = detectCategory(tags);

    // Use provided thumbnail from the search page
    const thumb = thumbnailUrl || $('meta[property="og:image"]').attr('content') || '';

    return {
      title,
      slug,
      embedUrl,
      thumbnailUrl: thumb,
      tags,
      category,
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
  } catch (err) {
    console.log(`  ❌ Failed to fetch video page for ${viewkey}: ${err.message}`);
    // Fallback: use basic info from search page
    const tags = ['sri-lankan', 'amateur', 'leaked'];
    const title = enhanceTitle(rawTitle, tags);
    const slug = slugify(title).slice(0, 80);
    return {
      title,
      slug,
      embedUrl,
      thumbnailUrl: thumbnailUrl || '',
      tags,
      category: 'amateur',
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
  }
}

async function scrapeSearchPage(url) {
  const { data } = await axios.get(url, {
    timeout: 20000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });

  const $ = cheerio.load(data);
  const items = [];
  const seen = new Set();

  $('li.videoBox').each((i, el) => {
    const link = $(el).find('a[href*="view_video.php?viewkey="]').first();
    const href = link.attr('href') || '';
    const title = link.attr('title') || $(el).find('img').attr('alt') || '';
    const thumbnail = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';

    const viewkeyMatch = href.match(/viewkey=([a-zA-Z0-9]+)/);
    if (!viewkeyMatch) return;
    const viewkey = viewkeyMatch[1];

    if (seen.has(viewkey)) return;
    seen.add(viewkey);

    if (title && title !== 'Play All') {
      items.push({ viewkey, title, thumbnail });
    }
  });

  return items;
}

async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));
  const existingSlugs = new Set(existing.map(v => v.slug));

  console.log(`\n📦 Existing videos: ${existing.length}`);
  console.log(`🔎 Scraping Pornhub search: "${SEARCH_URL}"\n`);

  let searchItems;
  try {
    searchItems = await scrapeSearchPage(SEARCH_URL);
    console.log(`✅ Found ${searchItems.length} unique videos on search page\n`);
  } catch (err) {
    console.error('❌ Failed to scrape search page:', err.message);
    process.exit(1);
  }

  const newEntries = [];

  for (let i = 0; i < searchItems.length; i++) {
    const { viewkey, title, thumbnail } = searchItems[i];
    const embedUrl = `https://www.pornhub.com/embed/${viewkey}`;

    process.stdout.write(`[${i+1}/${searchItems.length}] ${title.slice(0, 50)}...`);

    if (existingEmbeds.has(embedUrl)) {
      console.log(' ⏭️  Duplicate, skipping.');
      continue;
    }

    const meta = await fetchVideoMeta(viewkey, title, thumbnail);
    if (!meta) {
      console.log(' ❌ Failed.');
      continue;
    }

    // Ensure slug unique
    let finalSlug = meta.slug;
    let attempt = 1;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${meta.slug}-${attempt++}`;
    }
    meta.slug = finalSlug;
    existingSlugs.add(finalSlug);
    existingEmbeds.add(embedUrl);

    newEntries.push(meta);
    console.log(` ✅ "${meta.title.slice(0, 55)}" [${meta.category}]`);

    await sleep(DELAY_MS);
  }

  if (newEntries.length === 0) {
    console.log('\n⚠️  No new videos to add.');
    return;
  }

  // Prepend new entries (newest first)
  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');

  console.log(`\n✅ Done! Added ${newEntries.length} new Sri Lankan videos.`);
  console.log(`📦 Total videos now: ${updated.length}`);

  // Auto trigger IndexNow
  exec('node scripts/indexnow.js', { cwd: path.resolve(__dirname, '..') }, (err, stdout) => {
    if (err) { console.log('IndexNow skipped:', err.message); return; }
    console.log('📡 IndexNow:', stdout.trim());
  });

  // Auto-fix any expired thumbnail URLs after adding new videos
  console.log('\n🖼️  Running thumbnail fix to repair any expired CDN URLs...');
  exec('node scripts/fix_thumbnails.js', { cwd: path.resolve(__dirname, '..') }, (err, stdout) => {
    if (err) { console.error('❌ Thumbnail fix failed:', err.message); return; }
    console.log(stdout.trim());
  });
}

main();
