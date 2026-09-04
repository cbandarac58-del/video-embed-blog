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

const THREESOME_TITLES = [
  (k) => `Wild Threesome Fantasy – ${k} Shared And Fucked Hard`,
  (k) => `Ultimate 3-Way Action – ${k} Intense Threesome Scene`,
  (k) => `Uncensored Threesome – ${k} Double Team Madness`,
  (k) => `Hot ${k} Threesome Experience You Need To Watch`,
  (k) => `Crazy 3-Way Craving – ${k} Getting Double Pleasure`,
];

const THREESOME_DESCS = [
  (k, title) => `Watch this incredible 3-way video featuring ${title}. Intense and completely uncensored threesome action with ${k}.`,
  (k, title) => `${title} – One of the hottest threesome videos online right now. Watch as they fulfill their wild double team fantasy.`,
];

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function extractKeyword(rawTitle) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|naughty|america|pervcity|houseofyre|promo|official|enter|free|download|watch|mofozo|com|threesome|3way|3-way|triad|group|porn|sex|fuck|fucking|video|xxx)\b/gi;
  let cleaned = rawTitle.replace(/\s*[-|–]\s*(xvideos|hd|free|full movie).*$/i, '').replace(noisy, '').replace(/[_\-#@!]+/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ').filter(w => w.length > 1);
  if (words.length === 0) return 'Wild Action';
  return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function buildSEOTags(keywords) {
  const baseTags = ['threesome', '3-way', 'group-sex', 'double-team', 'triad'];
  const fromKeywords = (keywords || '').split(',')
    .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(k => k.length > 2 && !EXCLUDE_TAGS.has(k) && !/\d{4}/.test(k))
    .slice(0, 4);
  return [...new Set([...baseTags, ...fromKeywords])].slice(0, 8);
}

function getRandomViews() {
  const opts = ['320K','450K','680K','810K','950K','1.2M','1.8M','2.4M','3.1M','4.0M'];
  return opts[Math.floor(Math.random() * opts.length)];
}

function getRandomRating() { return Math.floor(Math.random() * 9) + 88; }

async function scrapeThreesomeVideos(targetLimit = 1000) {
  console.log(`🌐 Fetching ${targetLimit} Threesome videos via Official API...`);
  const scraped = [];
  let page = 1;

  // Eporner API එකෙන් පිටුවකට වීඩියෝ 50 බැගින් පිටු 45ක් දක්වා Scan කරයි
  while (scraped.length < targetLimit && page <= 45) {
    try {
      const url = `https://www.eporner.com/api/v2/video/search/?query=threesome&per_page=50&page=${page}&thumbsize=big&order=top-monthly&format=json`;
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000
      });

      const videos = res.data?.videos || [];

      if (videos.length === 0) {
        console.log(`No videos returned on page ${page}`);
        break;
      }

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
      await new Promise(r => setTimeout(r, 200));
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

  const rawVideos = await scrapeThreesomeVideos(1000);
  console.log(`Total raw videos collected: ${rawVideos.length}`);

  const newEntries = [];

  for (const raw of rawVideos) {
    if (!raw.embedUrl || existingEmbeds.has(raw.embedUrl)) continue;

    const keyword = extractKeyword(raw.rawTitle || '');
    const titleTpl = THREESOME_TITLES[Math.floor(Math.random() * THREESOME_TITLES.length)];
    const title = titleTpl(keyword);
    const descTpl = THREESOME_DESCS[Math.floor(Math.random() * THREESOME_DESCS.length)];
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
      category: 'threesome',
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
  console.log(`✅ Successfully added ${newEntries.length} new Threesome videos to database.json.`);
}

main().catch(e => console.error("Fatal:", e));
