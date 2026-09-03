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

const STEPSISTER_TITLES = [
  (k) => `Naughty Stepsister ${k} Begs To Get Fucked Hard`,
  (k) => `${k} Stepsister Catches Stepbro Watching – Then Joins In`,
  (k) => `Taboo Fantasy – Hot Stepsister ${k} Can't Resist Stepbrother`,
  (k) => `${k} Stepsis Needs A Big Cock Favor From Her Stepbro`,
  (k) => `Wild Stepsister ${k} – Secret Bedroom Fantasy Finally Revealed`,
];

const STEPSISTER_DESCS = [
  (k, title) => `Watch this incredible taboo video featuring ${title}. Hot, raw, and completely uncensored stepsister action with ${k}.`,
  (k, title) => `${title} – One of the hottest stepsister videos online right now. Watch as this sexy stepsis gets what she's been secretly craving.`,
];

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function extractKeyword(rawTitle) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|naughty|america|pervcity|houseofyre|promo|official|enter|free|download|watch|mofozo|com|step|sister|brother|stepsister|stepbrother|stepbro|stepsis|porn|sex|fuck|fucking|video|xxx|bro|sis)\b/gi;
  let cleaned = rawTitle.replace(/\s*[-|–]\s*(xvideos|hd|free|full movie).*$/i, '').replace(noisy, '').replace(/[_\-#@!]+/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ').filter(w => w.length > 1);
  if (words.length === 0) return 'Beauty';
  return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function buildSEOTags(keywords) {
  const baseTags = ['stepsister', 'taboo', 'stepbrother', 'teen', 'petite', 'family-taboo'];
  const fromKeywords = (keywords || '').split(',')
    .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(k => k.length > 2 && !EXCLUDE_TAGS.has(k) && !/\d{4}/.test(k))
    .slice(0, 4);
  return [...new Set([...baseTags, ...fromKeywords])].slice(0, 8);
}

function getRandomViews() {
  const opts = ['280K','410K','560K','720K','890K','1.1M','1.5M','2.0M','2.6M','3.2M'];
  return opts[Math.floor(Math.random() * opts.length)];
}

function getRandomRating() { return Math.floor(Math.random() * 9) + 87; }

async function scrapeStepsisterVideos(targetLimit = 500) {
  console.log(`🌐 Fetching ${targetLimit} Stepsister videos via proxy API...`);
  const scraped = [];
  let page = 1;

  while (scraped.length < targetLimit && page <= 25) {
    try {
      // Using EPORNER / XVideos free json middleware to bypass Cloudflare 429
      const url = `https://eporner-api.vercel.app/api/search?q=stepsister&page=${page}&per_page=30`;
      const res = await axios.get(url, { timeout: 15000 });
      const videos = res.data?.videos || res.data || [];

      if (!Array.isArray(videos) || videos.length === 0) {
        console.log(`No more videos found at page ${page}`);
        break;
      }

      let addedThisPage = 0;
      for (const v of videos) {
        const id = v.id || v.embed?.split('/embed/')[1] || v.embedframe?.split('/embedframe/')[1];
        const rawTitle = v.title || v.tf;
        const thumbnailUrl = v.default_thumb?.src || v.thumbnail || v.thumb;

        if (rawTitle) {
          scraped.push({
            rawTitle,
            embedUrl: id ? `https://www.xvideos.com/embedframe/${id}` : (v.embed || v.embedUrl || ''),
            thumbnailUrl: thumbnailUrl || '',
            keywords: v.keywords || rawTitle
          });
          addedThisPage++;
        }
        if (scraped.length >= targetLimit) break;
      }

      console.log(`Page ${page}: Fetched ${addedThisPage} videos (Total: ${scraped.length})`);
      page++;
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`Page ${page} failed: ${e.message}. Trying next page...`);
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

  const rawVideos = await scrapeStepsisterVideos(500);
  console.log(`Total raw fetched: ${rawVideos.length}`);

  const newEntries = [];

  for (const raw of rawVideos) {
    if (!raw.embedUrl || existingEmbeds.has(raw.embedUrl)) continue;

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
    console.log("No new unique entries found.");
    return;
  }

  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`✅ Successfully added ${newEntries.length} new videos to database.json.`);
}

main().catch(e => console.error("Fatal error:", e));
