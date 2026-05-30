import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const XXXBP_URLS = [
  'https://xxxbp.tv/video/222598/ellie-novas-step-dad-cannot-stop-himself-from-having-sex-with-her-due-to-her-tight-vagina-and-big-breasts',
  'https://xxxbp.tv/video/250086/mohinilaxmi-stepson',
  'https://xxxbp.tv/video/267565/ellie-nova-big-tits',
  'https://xxxbp.tv/video/226724/super-hot-indian-woman-in-lingerie-gets-a-lot-of-sex-and-cum-on-her-face',
  'https://xxxbp.tv/video/884295/ellie-nova-stepsister-bedroom-ride',
  'https://xxxbp.tv/video/261808/layla-jenner-porn',
  'https://xxxbp.tv/video/430980/natsuko-mishima-hardcore',
  'https://xxxbp.tv/video/183185/new-full-length-bdsm-video-featuring-naile-lopez-on-bdsmxtube',
  'https://xxxbp.tv/video/196676/an-uncensored-series-of-homemade-indian-porn-featuring-big-boned-wives-getting-creampied',
  'https://xxxbp.tv/video/468661/stepsister-ass-watching',
  'https://xxxbp.tv/video/109711/uncles-secret-love-for-his-niece-revealed-in-homemade-web-series',
  'https://xxxbp.tv/video/210603/stepmother-charlie-forde-in-charge-with-her-big-chest-and-ass-in-missax-video',
  'https://xxxbp.tv/video/260584/ellie-nova-tickling',
  'https://xxxbp.tv/video/275055/indian-stepsis-sex',
  'https://xxxbp.tv/video/151324/whitney-wrights-seduction-of-stepbrother-leads-to-passionate-sex',
  'https://xxxbp.tv/video/7134/mature-idol-with-male-partner-and-two-women',
  'https://xxxbp.tv/video/743555/old-and-teen-porn',
  'https://xxxbp.tv/video/594070/indian-stepmom-sex',
  'https://xxxbp.tv/video/200763/alina-lopez-experiences-intense-and-vocal-pleasure-from-rough-domination',
  'https://xxxbp.tv/video/97318/amateur-desi-girl-with-a-big-ass-gets-on-her-knees-for-faapy',
  'https://xxxbp.tv/video/223522/ellie-nova-in-naughty-little-sister-8-step-sis-temptations',
];

const EXCLUDE_KEYWORDS = new Set([
  'xxxbp','xxxbp.tv','xxx','porn','video','videos','hd','free','sex','watch'
]);

const CATEGORY_MAP = [
  { keys: ['indian','desi','hindi','desi-bhabhi','indian-sex','mohinilaxmi'], cat: 'Indian' },
  { keys: ['stepsister','step-sis','stepsis','stepsiblings','step-sister'], cat: 'stepsister' },
  { keys: ['stepdad','stepdaughter','step-dad','dilf','taboo'], cat: 'stepsister' },
  { keys: ['stepmom','stepmother','step-mom','milf','mature'], cat: 'MILF' },
  { keys: ['latina','colombia','venezuelan','spanish'], cat: 'latina' },
  { keys: ['lesbian','girlsway'], cat: 'lesbian' },
  { keys: ['anal','anal-sex'], cat: 'anal' },
  { keys: ['asian','japanese','natsuko','japanese-idol'], cat: 'asian' },
  { keys: ['amateur','homemade','real-sex'], cat: 'amateur' },
  { keys: ['threesome','3some','gangbang'], cat: 'threesome' },
  { keys: ['bdsm','domination','rough','bondage'], cat: 'hardcore' },
  { keys: ['hardcore','rough'], cat: 'hardcore' },
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

function extractVideoId(url) {
  const match = url.match(/\/video\/(\d+)\//);
  return match ? match[1] : null;
}

function cleanTitle(rawTitle) {
  return rawTitle
    .replace(/\s*[-|]\s*(XXXBP|XXX BP|xxxbp\.tv).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

async function fetchVideoMeta(url) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    console.log(`  ⚠️  Could not extract video ID from: ${url}`);
    return null;
  }

  const embedUrl = `https://xxxbp.tv/embed/${videoId}`;

  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(data);
    const rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';
    const rawKeywords = $('meta[name="keywords"]').attr('content') || '';

    const tags = rawKeywords
      .split(',')
      .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(k => k.length > 2 && !EXCLUDE_KEYWORDS.has(k))
      .slice(0, 6);

    const title = cleanTitle(rawTitle);
    const slug = slugify(title).slice(0, 80);
    const category = detectCategory(tags);

    return {
      title,
      slug,
      embedUrl,
      thumbnailUrl: thumbnail,
      tags,
      category,
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: '2026-05-29'
    };
  } catch (err) {
    console.log(`  ❌ Failed ${url}: ${err.message}`);
    return null;
  }
}

async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const existingSlugs = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  console.log(`\n📦 Existing videos: ${existing.length}`);
  console.log(`🔗 Processing ${XXXBP_URLS.length} xxxbp.tv URLs...\n`);

  const newEntries = [];

  for (let i = 0; i < XXXBP_URLS.length; i++) {
    const url = XXXBP_URLS[i];
    const videoId = extractVideoId(url);
    const embedUrl = `https://xxxbp.tv/embed/${videoId}`;

    process.stdout.write(`[${i+1}/${XXXBP_URLS.length}] Fetching...`);

    if (existingEmbeds.has(embedUrl)) {
      console.log(` ⏭️  Duplicate, skipping.`);
      continue;
    }

    const meta = await fetchVideoMeta(url);
    if (!meta) { console.log(` ❌ Failed.`); continue; }

    let finalSlug = meta.slug;
    let attempt = 1;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${meta.slug}-${attempt++}`;
    }
    meta.slug = finalSlug;
    existingSlugs.add(finalSlug);
    existingEmbeds.add(embedUrl);

    newEntries.push(meta);
    console.log(` ✅ "${meta.title.slice(0, 55)}..." [${meta.category}]`);

    await sleep(700);
  }

  if (newEntries.length === 0) {
    console.log('\n⚠️  No new videos to add.');
    return;
  }

  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');

  console.log(`\n✅ Done! Added ${newEntries.length} new videos.`);
  console.log(`📦 Total videos now: ${updated.length}`);

  console.log('\n🚀 Triggering IndexNow to notify search engines...');
  exec('node scripts/indexnow.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ IndexNow trigger failed:', err);
      return;
    }
    console.log(stdout);
  });
}

main();
