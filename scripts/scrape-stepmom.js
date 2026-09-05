import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','x-video','porn','video','videos',
  'hd','free','raw','mms','leak','leaked','bangbros','brazzers','pervcity',
  'houseofyre','xvid','xv','adult','xxx','sex','tube','watch','full',
  'scene','movie','clip','download','online','streaming'
]);

const STEPMOM_TITLES = [
  (k) => `Naughty Step Mom ${k} Begs To Get Fucked Hard`,
  (k) => `${k} Step Mom Catches Stepson Watching – Then Joins In`,
  (k) => `Taboo Fantasy – Hot Step Mom ${k} Can't Resist Stepson`,
  (k) => `${k} Step Mom Needs A Big Cock Favor From Her Stepson`,
  (k) => `Wild Step Mom ${k} – Secret Bedroom Fantasy Finally Revealed`,
];

const STEPMOM_DESCS = [
  (k, title) => `Watch this incredible taboo video featuring ${title}. Hot, raw, and completely uncensored step mom action with ${k}.`,
  (k, title) => `${title} – One of the hottest step mom videos online right now. Watch as this sexy stepmom gets what she's been secretly craving.`,
];

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function extractKeyword(rawTitle) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|naughty|america|pervcity|houseofyre|promo|official|enter|free|download|watch|mofozo|com|step|mom|mother|stepmom|stepmother|son|stepson|porn|sex|fuck|fucking|video|xxx)\b/gi;
  let cleaned = rawTitle.replace(/\s*[-|–]\s*(xvideos|hd|free|full movie).*$/i, '').replace(noisy, '').replace(/[_\-#@!]+/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ').filter(w => w.length > 1);
  if (words.length === 0) return 'Beauty';
  return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function buildSEOTags(keywords) {
  const baseTags = ['step-mom', 'taboo', 'milf', 'family-taboo', 'mature', 'stepson'];
  const fromKeywords = (keywords || '').split(',')
    .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(k => k.length > 2 && !EXCLUDE_TAGS.has(k) && !/\d{4}/.test(k))
    .slice(0, 4);
  return [...new Set([...baseTags, ...fromKeywords])].slice(0, 8);
}

function getRandomViews() {
  const opts = ['380K','510K','660K','820K','990K','1.2M','1.8M','2.3M','2.9M','3.5M'];
  return opts[Math.floor(Math.random() * opts.length)];
}

function getRandomRating() { return Math.floor(Math.random() * 9) + 88; }

async function scrapeStepmomVideos(targetLimit = 1000) {
  console.log(`🌐 Fetching ${targetLimit} Step Mom videos via Official API...`);
  const scraped = [];
  let page = 1;

  while (scraped.length < targetLimit && page <= 40) {
    try {
      const url = `https://www.eporner.com/api/v2/video/search/?query=stepmom&per_page=30&page=${page}&thumbsize=big&order=top-monthly&format=json`;
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000
      });

      const videos = res.data?.videos || [];
      if (videos.length === 0) break;

      for (const v of videos) {
        if (v.embed && v.title) {
          scraped.push({
            rawTitle: v.title,
            embedUrl: v.embed,
            thumbnailUrl: v.default_thumb?.src || v.thumbs?.[0]?.src || '',
            keywords: v.keywords || v.title
          });
        }
        if (scraped.length >= targetLimit) break;
      }

      console.log(`Page ${page}: Fetched ${videos.length} items (Total accumulated: ${scraped.length})`);
      page++;
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.log(`Error on page ${page}: ${e.message}`);
      page++;
    }
  }
  return scraped;
}

async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  let existing = [];
  
  if (fs.existsSync(dbPath)) {
    existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }

  const existingSlugs = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  const rawVideos = await scrapeStepmomVideos(1000);
  console.log(`Total raw videos collected: ${rawVideos.length}`);

  const newEntries = [];

  for (const raw of rawVideos) {
    if (!raw.embedUrl || existingEmbeds.has(raw.embedUrl)) continue;

    const keyword = extractKeyword(raw.rawTitle || '');
    const titleTpl = STEPMOM_TITLES[Math.floor(Math.random() * STEPMOM_TITLES.length)];
    const title = titleTpl(keyword);
    const descTpl = STEPMOM_DESCS[Math.floor(Math.random() * STEPMOM_DESCS.length)];
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
      category: 'Step Mom',
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: new Date().toISOString().split('T')[0],
    });
  }

  if (newEntries.length === 0) {
    console.log("No new unique entries to write.");
    return;
  }

  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`✅ Successfully added ${newEntries.length} new Step Mom videos to database.json.`);
}

main().catch(e => console.error("Fatal:", e));
