import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CATEGORY_URL = 'https://www.xvideos.com/c/Arab-159';

// ─── Generic keywords to exclude from tags ────────────────────────────────────
const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','x-video','porn','video','videos',
  'hd','free','raw','mms','leak','leaked','bangbros','brazzers','pervcity',
  'houseofyre','xvid','xv','adult','xxx','sex','tube','watch','full',
  'scene','movie','clip','download','online','streaming'
]);

// ─── Category Detection ───────────────────────────────────────────────────────
const CATEGORY_MAP = [
  { keys: ['indian','desi','hindi','jiju','saali','bhabhi','malkin','devar','debar','nokar','mosi','bhabhiji','punjabi','bengali','tamil','telugu'], cat: 'Indian' },
  { keys: ['stepsister','step-sister','stepsis','stepsiblings','behn','stepdaughter','step-daughter'], cat: 'stepsister' },
  { keys: ['stepmom','step-mom','milf','mature','stepmother','cougar','stepaunt','step-aunt'], cat: 'MILF' },
  { keys: ['latina','colombia','venezolana','spanish','español','mexican','colombia','peru','chile','argentina'], cat: 'latina' },
  { keys: ['lesbian','girlsway','girl-on-girl','girls-kissing'], cat: 'lesbian' },
  { keys: ['anal','ass-fuck','anal-sex','analed','butt-fuck'], cat: 'anal' },
  { keys: ['asian','japanese','korean','thai','chinese','filipina','vietnam'], cat: 'asian' },
  { keys: ['threesome','3some','gangbang','dp','double-penetration','group','orgy','foursome'], cat: 'threesome' },
  { keys: ['arab','arabic','hijab','muslim','egyptian','turkish','moroccan','lebanese','saudi'], cat: 'arab' },
  { keys: ['ebony','black','bbc','interracial'], cat: 'ebony' },
  { keys: ['big-ass','big-butt','booty','pawg','bubble-butt','fat-ass'], cat: 'big-ass' },
  { keys: ['big-tits','big-boobs','huge-tits','busty','large-breasts'], cat: 'big-tits' },
  { keys: ['teen','teenager','18','young','college','student'], cat: 'teen' },
  { keys: ['hardcore','rough','pounded','bdsm','dominated','rough-sex'], cat: 'hardcore' },
];

// ─── SEO Title Templates by Category ─────────────────────────────────────────
const SEO_TEMPLATES = {
  Indian: [
    (k) => `Desi ${k} – Hardcore Indian Homemade XXX`,
    (k) => `Hot Indian ${k} – Wild Desi Fuck Session`,
    (k) => `Sexy ${k} Caught On Cam – Real Desi MMS`,
    (k) => `${k} Desi Romance – Passionate Indian XXX`,
    (k) => `${k} Ki Chudai – Steamy Hindi Audio Sex Video`,
  ],
  MILF: [
    (k) => `Horny MILF ${k} – Can't Get Enough Big Cock`,
    (k) => `Hot Stepmom ${k} Seduces Stepson Into Bed`,
    (k) => `${k} MILF – Mature Beauty's Secret Naughty Fantasy`,
    (k) => `Sexy ${k} Stepmom Shows Stepson What Real Sex Is`,
    (k) => `Busty MILF ${k} Takes Hard Cock Like A Pro`,
  ],
  stepsister: [
    (k) => `Naughty Stepsister ${k} Begs To Get Fucked Hard`,
    (k) => `${k} Stepsister Catches Stepbro Watching – Then Joins In`,
    (k) => `Taboo ${k} – Hot Stepsister Can't Resist Stepbrother`,
    (k) => `${k} Stepsis Needs A Big Cock Favor From Her Stepbro`,
    (k) => `Wild Stepsister ${k} – Secret Bedroom Fantasy Revealed`,
  ],
  latina: [
    (k) => `Spicy Latina ${k} – Fiery Passionate Fuck Session`,
    (k) => `Hot ${k} Latina Rides Big Cock Like A Champion`,
    (k) => `${k} – Sexy Latina Beauty's Wild Night`,
    (k) => `Curvy Latina ${k} Gets Pounded In Every Position`,
    (k) => `${k} Latina Takes It Deep & Loves Every Second`,
  ],
  arab: [
    (k) => `Sexy Arab ${k} – Hidden Desires Finally Revealed`,
    (k) => `${k} Hijab Beauty Gets Naughty Behind Closed Doors`,
    (k) => `Hot Arabic ${k} – Taboo Passion & Wild Fucking`,
    (k) => `${k} – Stunning Arab Babe's Secret Sex Tape`,
    (k) => `Forbidden Arab ${k} – Passionate Hidden Romance`,
  ],
  anal: [
    (k) => `${k} – Tight Ass Gets Destroyed In Hardcore Anal`,
    (k) => `Anal Obsessed ${k} – Deep Ass Fucking Session`,
    (k) => `${k} Takes Big Cock Deep In Her Perfect Tight Ass`,
    (k) => `First Time Anal ${k} – She Can't Believe How Good It Feels`,
    (k) => `${k} – Butthole Destroyed By Massive Cock Anal Fuck`,
  ],
  threesome: [
    (k) => `${k} – Wild Threesome Nobody Could Resist`,
    (k) => `Hot ${k} Threesome – Two Girls One Lucky Guy`,
    (k) => `${k} Group Sex – Everybody Gets What They Want`,
    (k) => `Steamy ${k} Threesome – Sharing Is Caring In Bed`,
    (k) => `${k} – DP Threesome Fantasy Becomes Reality`,
  ],
  ebony: [
    (k) => `${k} – Sexy Ebony Beauty Takes BBC Deep`,
    (k) => `Hot Ebony ${k} – Wild Interracial Fuck Session`,
    (k) => `${k} Ebony Babe Riding BBC Like A Pro`,
    (k) => `Gorgeous ${k} – Ebony Queen's Passionate Night`,
    (k) => `${k} – Big Black Dick Pounds Her Tight Wet Pussy`,
  ],
  'big-ass': [
    (k) => `${k} – Massive Booty Gets Worshipped & Destroyed`,
    (k) => `Thicc ${k} – Big Ass Beauty Loves Hard Doggystyle`,
    (k) => `${k} PAWG Takes Every Inch Deep Inside Her`,
    (k) => `Fat Ass ${k} – Bubble Butt Riding Session`,
    (k) => `${k} – Huge Ass Babe's Wild Fuck Fantasy`,
  ],
  teen: [
    (k) => `${k} – 18yo Teen Beauty's First Wild Experience`,
    (k) => `Hot Teen ${k} – Young & Horny First Time`,
    (k) => `${k} College Teen Can't Get Enough Cock`,
    (k) => `Innocent ${k} Teen Goes Wild In Secret Session`,
    (k) => `${k} – Petite Teen Takes Huge Cock Like A Pro`,
  ],
  hardcore: [
    (k) => `${k} – Rough Hardcore Fuck She Won't Forget`,
    (k) => `Hard & Fast ${k} – No Mercy Rough Sex Session`,
    (k) => `${k} Gets Pounded Mercilessly In Wild Hardcore Scene`,
    (k) => `Dominant ${k} – Rough Fuck Until She Screams`,
    (k) => `${k} – Balls Deep Rough Fucking Non Stop`,
  ],
  lesbian: [
    (k) => `${k} – Hot Lesbian Passion Between Two Beauties`,
    (k) => `Sensual ${k} – Girls Making Each Other Cum`,
    (k) => `${k} Lesbian Fantasy – Tongue & Fingers All Night`,
    (k) => `${k} – Two Hot Girls Can't Keep Hands Off Each Other`,
    (k) => `Steamy Lesbian ${k} – Scissoring & Squirting Session`,
  ],
  asian: [
    (k) => `${k} – Exotic Asian Beauty's Passionate Sex Scene`,
    (k) => `Hot ${k} Asian Babe Rides Hard Until She Cums`,
    (k) => `${k} – Japanese Cutie Gets Pounded Deep`,
    (k) => `Petite Asian ${k} Takes Big Cock In Tight Pussy`,
    (k) => `${k} – Gorgeous Asian Beauty's Wild Sex Fantasy`,
  ],
  amateur: [
    (k) => `${k} – Real Amateur Couple's Steamy Home Session`,
    (k) => `${k} Homemade – Genuine Passion Caught On Cam`,
    (k) => `Real ${k} – Amateur Beauty's Wild Orgasm`,
    (k) => `${k} – Authentic Amateur Sex Nobody Was Meant To See`,
    (k) => `${k} Real Homemade – No Fake Moans Just Raw Passion`,
  ],
};

// ─── SEO Tag Templates by Category ───────────────────────────────────────────
const CATEGORY_TAGS = {
  Indian: ['desi','indian','hindi','homemade','bhabhi','indian-sex'],
  MILF: ['milf','stepmom','mature','big-tits','stepson','cougar'],
  stepsister: ['stepsister','taboo','stepbrother','teen','petite','family-taboo'],
  latina: ['latina','spanish','curvy','big-ass','passionate','exotic'],
  arab: ['arab','hijab','muslim','arabic','exotic','middle-eastern'],
  anal: ['anal','ass-fuck','big-ass','hardcore','creampie','tight-ass'],
  threesome: ['threesome','dp','group-sex','two-girls','big-cock','sharing'],
  ebony: ['ebony','bbc','interracial','big-ass','black','chocolate'],
  'big-ass': ['big-ass','pawg','booty','doggystyle','curvy','bubble-butt'],
  teen: ['teen','18','young','petite','college','first-time'],
  hardcore: ['hardcore','rough','pounded','rough-sex','dominated','intense'],
  lesbian: ['lesbian','girl-on-girl','pussy-licking','strap-on','sensual','scissoring'],
  asian: ['asian','exotic','petite','japanese','tight','cute'],
  amateur: ['amateur','homemade','real','couple','authentic','voyeur'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function detectCategory(tags, title) {
  const combined = (tags.join(' ') + ' ' + title).toLowerCase();
  for (const { keys, cat } of CATEGORY_MAP) {
    if (keys.some(k => combined.includes(k))) return cat;
  }
  return 'amateur';
}

function extractVideoId(url) {
  const match = url.match(/\/video\.([a-z0-9]+)\//i);
  return match ? match[1] : null;
}

/** Generate a fresh, unique SEO title using raw title keywords + category */
function generateSEOTitle(rawTitle, category) {
  // Extract the most meaningful 2-4 words from raw title (skip platform noise)
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|naughty|america|pervcity|houseofyre|promo|full|official|enter|free|download|watch)\b/gi;
  let cleaned = rawTitle
    .replace(/\s*[-|–]\s*(xvideos|hd|free|full movie).*$/i, '')
    .replace(noisy, '')
    .replace(/[_\-#@!]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize each word
  const words = cleaned.split(' ').filter(w => w.length > 1);
  const keyword = words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const templates = SEO_TEMPLATES[category] || SEO_TEMPLATES['amateur'];
  const tpl = templates[Math.floor(Math.random() * templates.length)];
  return tpl(keyword || 'Beauty');
}

/** Build SEO-optimized tags: raw keywords filtered + category defaults */
function buildSEOTags(rawKeywords, category, title) {
  const fromMeta = rawKeywords.split(',')
    .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(k => k.length > 2 && !EXCLUDE_TAGS.has(k) && !/\d{4}/.test(k))
    .slice(0, 4);

  const catDefaults = CATEGORY_TAGS[category] || CATEGORY_TAGS['amateur'];
  // Merge, deduplicate, pick best 8
  const merged = [...new Set([...fromMeta, ...catDefaults])].slice(0, 8);
  return merged;
}

function getRandomViews() {
  const opts = ['310K','450K','620K','780K','950K','1.2M','1.6M','2.1M','2.8M','3.4M'];
  return opts[Math.floor(Math.random() * opts.length)];
}
function getRandomRating() { return Math.floor(Math.random() * 9) + 87; }
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// ─── Main fetch ───────────────────────────────────────────────────────────────
async function fetchVideoMeta(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;
  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    const $ = cheerio.load(data);
    let rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';
    const rawKeywords = $('meta[name="keywords"]').attr('content') || '';

    // Fallback: use URL slug if title is garbage
    if (!rawTitle || rawTitle.trim() === '_' || rawTitle.toLowerCase().includes('xvideos.com')) {
      const parts = url.split('/');
      rawTitle = (parts[parts.length - 1] || parts[parts.length - 2] || '').replace(/[_\-]+/g, ' ');
    }

    const rawTags = rawKeywords.split(',').map(k => k.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean);
    const category = detectCategory(rawTags, rawTitle);
    const title = generateSEOTitle(rawTitle, category);
    const tags = buildSEOTags(rawKeywords, category, rawTitle);
    const slug = slugify(title).slice(0, 90);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    return { title, slug, embedUrl, thumbnailUrl: thumbnail, tags, category, rating: getRandomRating(), views: getRandomViews(), dateAdded: '2026-05-29' };
  } catch (err) {
    return null;
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────
async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const existingSlugs = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  console.log(`📦 Existing videos: ${existing.length}`);
  console.log(`🔗 Scraping: ${CATEGORY_URL}\n`);

  const { data: pageHtml } = await axios.get(CATEGORY_URL, {
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });

  const $ = cheerio.load(pageHtml);
  const watchUrls = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && /\/video\.[a-z0-9]+\//i.test(href)) {
      const abs = href.startsWith('/') ? 'https://www.xvideos.com' + href : href;
      if (!watchUrls.includes(abs)) watchUrls.push(abs);
    }
  });

  console.log(`🔍 Found ${watchUrls.length} video URLs.\n`);

  const newEntries = [];
  for (let i = 0; i < watchUrls.length; i++) {
    const url = watchUrls[i];
    const videoId = extractVideoId(url);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    process.stdout.write(`[${i+1}/${watchUrls.length}] Fetching...`);
    if (existingEmbeds.has(embedUrl)) { console.log(` ⏭️  Duplicate.`); continue; }

    const meta = await fetchVideoMeta(url);
    if (!meta) { console.log(` ❌ Failed.`); continue; }

    let finalSlug = meta.slug;
    let attempt = 1;
    while (existingSlugs.has(finalSlug)) finalSlug = `${meta.slug}-${attempt++}`;
    meta.slug = finalSlug;
    existingSlugs.add(finalSlug);
    existingEmbeds.add(embedUrl);
    newEntries.push(meta);
    console.log(` ✅ [${meta.category}] "${meta.title.slice(0,60)}"`);
    await sleep(600);
  }

  if (newEntries.length === 0) { console.log('\n⚠️ No new videos found.'); return; }

  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`\n✅ Done! Added ${newEntries.length} new videos.`);
  console.log(`📦 Total: ${updated.length}`);

  console.log('\n🚀 Triggering IndexNow to notify search engines...');
  exec('node scripts/indexnow.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ IndexNow trigger failed:', err);
      return;
    }
    console.log(stdout);
  });
}

main().catch(e => console.error('Error:', e.message));
