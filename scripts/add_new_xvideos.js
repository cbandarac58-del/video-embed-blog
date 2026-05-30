import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const XVIDEOS_URLS = [
  'https://www.xvideos.com/video.okuttvv9746/porn-hi/0/desi_debar_hardcore_fuck_with_her_widow_bhabhi_infront_of_his_wife_full_movie_hindi_audio_',
  'https://www.xvideos.com/video.okfukdv61fd/porn-hi/0/desi_indian_boy_18_fucking_tight_virgin_punjabi_village_girl_pussy_hindi_audio_',
  'https://www.xvideos.com/video.otiblovca41/porn-hi/0/step_brother_and_sister',
  'https://www.xvideos.com/video.ouilktk8cc7/porn-hi/0/my_big_stepsister_was_angry_we_shared_single_bed_full_hindi_audio',
  'https://www.xvideos.com/video.ouomovi0fa1/porn-hi/0/_',
  'https://www.xvideos.com/video.otutbvd5b9d/porn-hi/0/house_maid_fucked_by_owner',
  'https://www.xvideos.com/video.oiiuatv6867/porn-hi/0/step_family_threesome_-_step_mom_starsudipa_helps_her_step_son_to_fuck_her_step_sister_full_movie_hindi_audio_',
  'https://www.xvideos.com/video.ohlvccdfb27/porn-hi/0/big_boobs_full_milky_wife_offered_her_pussy_to_her_ex-boyfriend',
  'https://www.xvideos.com/video.kkdeolbbbb6/porn-hi/0/_',
  'https://www.xvideos.com/video.othhmphc764/porn-hi/0/female_friend_invited_to_home_for_group_study',
  'https://www.xvideos.com/video.ohcvfvv02b4/porn-hi/0/three_indian_bhabhi_s_pussy_rough_fucked_by_a_male_friend',
  'https://www.xvideos.com/video.ohicftb7360/porn-hi/0/husband_tells_his_friend_to_have_sex_with_his_wife',
  'https://www.xvideos.com/video.othuhbkcd5b/porn-hi/0/indian_desi_village_college_girl_fucked_by_taking_her_to_jungle',
  'https://www.xvideos.com/video.uotipfu3ebd/porn-hi/0/rumppa21_couple_sex_very_hurd_cute_sexy_bikini_hot_girl_with_her_boyfriend',
  'https://www.xvideos.com/video.uamdaefbeed/porn-hi/0/_',
  'https://www.xvideos.com/video.outfeihf289/porn-hi/0/indian_desi_wife_fucked_by_her_husband_on_a_special_day',
  'https://www.xvideos.com/video.oolvfbi729d/porn-hi/0/hot_indian_wife_gets_rough_fuck_from_behind_-_intense_bedroom_sex',
  'https://www.xvideos.com/video.kcbhvkff724/porn-hi/0/_',
  'https://www.xvideos.com/video.ufdaccb4b3c/porn-hi/0/poor_vegetable_girl_sex_indian_hot_sex',
  'https://www.xvideos.com/video.uficeiff92f/porn-hi/0/newly_married_bhabhiji_fucked_by_devar_blindfolded_full_movie_',
  'https://www.xvideos.com/video.uffofkv2af4/porn-hi/0/xxx_indian_step_mom_desi_xxx_in_hindi_xxx',
  'https://www.xvideos.com/video.okfmumk2bf6/porn-hi/0/the_guy_who_has_such_a_hot_girlfriend_will_want_to_have_sex.',
  'https://www.xvideos.com/video.umkpfhf476d/porn-hi/0/badi_behn_took_advantage_when_there_was_no_one_in_the_house_in_hindi_voice_',
  'https://www.xvideos.com/video.ihbuldk4353/porn-hi/0/p._chopra_hot_bed_scene_quantico',
  'https://www.xvideos.com/video.udtelvfba53/porn-hi/0/mosi_ki_ladki_ko_nanga_kr_ke_choda_hindi_family_sex',
  'https://www.xvideos.com/video.uducheb4110/porn-hi/0/suchi_bhabhi_midnight_sex_with_naughty_devar_real_desi_fucking',
  'https://www.xvideos.com/video.uokfvpv996c/porn-hi/0/gorgeous_malkin_nokar_xxx_sex_with_clear_audio_your_priya'
];

const EXCLUDE_KEYWORDS = new Set([
  'xvideos', 'xvideos.com', 'x videos', 'x video', 'porn', 'video', 'videos', 'hd', 'free', 'raw', 'mms', 'leak', 'leaked'
]);

const CATEGORY_MAP = [
  { keys: ['indian', 'desi', 'hindi', 'jiju', 'saali', 'bhabhi', 'malkin', 'devar', 'debar', 'nokar', 'mosi', 'bhabhiji', 'punjabi'], cat: 'Indian' },
  { keys: ['stepsister', 'step-sister', 'stepsis', 'stepsiblings', 'behn'], cat: 'stepsister' },
  { keys: ['stepmom', 'step-mom', 'milf', 'mature', 'mom', 'stepmother'], cat: 'MILF' },
  { keys: ['latina', 'colombia', 'venezolana', 'spanish', 'español'], cat: 'latina' },
  { keys: ['lesbian', 'girlsway'], cat: 'lesbian' },
  { keys: ['anal', 'anal-sex'], cat: 'anal' },
  { keys: ['asian', 'japanese', 'korean'], cat: 'asian' },
  { keys: ['amateur', 'homemade', 'real-sex', 'couple'], cat: 'amateur' },
  { keys: ['threesome', '3some', 'gangbang', 'dp'], cat: 'threesome' },
  { keys: ['hardcore', 'rough', 'hurd'], cat: 'hardcore' },
];

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function detectCategory(tags, title) {
  const combined = (tags.join(' ') + ' ' + title).toLowerCase();
  for (const { keys, cat } of CATEGORY_MAP) {
    if (keys.some(k => combined.includes(k))) return cat;
  }
  return 'Indian'; // Default to Indian since most of these URLs are Desi
}

function extractVideoId(url) {
  const match = url.match(/\/video\.([a-z0-9]+)\//i);
  return match ? match[1] : null;
}

// Transform raw text into standard high-value SEO Titles
function cleanSEOTitle(rawTitle) {
  let clean = rawTitle
    .replace(/\s*-\s*(xvideos|xvideo|xvid|xv|hd).*$/i, '')
    .replace(/\b(xvideos|xvid|xv promo|brazzers|enter xvpromo|rumppa21|starsudipa|faapy|p\. chopra|quantico|your priya|mms|leak|leaked)\b/gi, '')
    .replace(/[_\-]+/g, ' ') // Replace underscores and hyphens with space
    .replace(/\s+/g, ' ')
    .trim();

  // Custom standard replacements for cleaner presentation
  clean = clean
    .replace(/\bdebar\b/gi, 'Devar')
    .replace(/\bbhabhi\b/gi, 'Bhabhi')
    .replace(/\bdevar\b/gi, 'Devar')
    .replace(/\bnokar\b/gi, 'Nokar')
    .replace(/\bmosi\b/gi, 'Mausi')
    .replace(/\bbehn\b/gi, 'Behan')
    .replace(/\bchoda\b/gi, 'Fucked')
    .replace(/\bkr ke\b/gi, '')
    .replace(/\bnanga\b/gi, 'Nude')
    .replace(/\bdesi\b/gi, 'Desi')
    .replace(/\bindian\b/gi, 'Indian');

  // Capitalize properly
  clean = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Add high-value SEO modifiers if title is too short
  if (clean.length < 25) {
    if (clean.toLowerCase().includes('step')) {
      clean = `Premium Taboo: ${clean} Hot Scene`;
    } else {
      clean = `Desi Exclusive: ${clean} Hardcore Scene`;
    }
  }

  return clean;
}

function getRandomViews() {
  const options = ['310K', '450K', '620K', '780K', '940K', '1.2M', '1.6M', '2.1M', '2.7M', '3.5M'];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomRating() {
  return Math.floor(Math.random() * 10) + 88; // 88% - 97%
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

  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(data);
    
    // Attempt multiple metadata paths
    let rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';
    const rawKeywords = $('meta[name="keywords"]').attr('content') || '';

    // If title is empty or just underscores, parse page body h1
    if (!rawTitle || rawTitle.trim() === '_' || rawTitle.trim() === 'XVideos.com') {
      rawTitle = $('h1.page-title').text() || '';
    }
    
    // Extract title from URL slug as absolute fallback
    if (!rawTitle || rawTitle.trim() === '' || rawTitle.trim() === '_') {
      const parts = url.split('/');
      const slugPart = parts[parts.length - 1] || parts[parts.length - 2] || '';
      rawTitle = slugPart.replace(/[_\-]+/g, ' ');
    }

    const tags = rawKeywords
      .split(',')
      .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(k => k.length > 2 && !EXCLUDE_KEYWORDS.has(k))
      .slice(0, 6);

    const title = cleanSEOTitle(rawTitle);
    const slug = slugify(title).slice(0, 80);
    const category = detectCategory(tags, title);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

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
    console.log(`  ❌ Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const existingSlugs = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  console.log(`\n📦 Existing videos: ${existing.length}`);
  console.log(`🔗 Processing ${XVIDEOS_URLS.length} URLs...\n`);

  const newEntries = [];

  for (let i = 0; i < XVIDEOS_URLS.length; i++) {
    const url = XVIDEOS_URLS[i];
    const videoId = extractVideoId(url);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    process.stdout.write(`[${i+1}/${XVIDEOS_URLS.length}] Fetching...`);

    // Skip duplicates
    if (existingEmbeds.has(embedUrl)) {
      console.log(` ⏭️  Duplicate, skipping.`);
      continue;
    }

    const meta = await fetchVideoMeta(url);
    
    if (!meta) {
      console.log(` ❌ Failed.`);
      continue;
    }

    // Ensure slug is unique
    let finalSlug = meta.slug;
    let attempt = 1;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${meta.slug}-${attempt++}`;
    }
    meta.slug = finalSlug;
    existingSlugs.add(finalSlug);
    existingEmbeds.add(embedUrl);

    newEntries.push(meta);
    console.log(` ✅ "${meta.title.slice(0,55)}..." [${meta.category}]`);

    // Small delay to avoid rate limiting
    await sleep(600);
  }

  if (newEntries.length === 0) {
    console.log('\n⚠️  No new videos to add.');
    return;
  }

  // Prepend new entries (newest first)
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
