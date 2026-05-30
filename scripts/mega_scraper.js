import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────
// Add as many categories + how many pages each
const TARGETS = [
  // === INDIAN / DESI ===
  { url: 'https://www.xvideos.com/c/Indian-50',       pages: 8 },
  { url: 'https://www.xvideos.com/c/Desi-262',        pages: 6 },
  // === MILF / STEPMOM ===
  { url: 'https://www.xvideos.com/c/MILF-44',         pages: 8 },
  { url: 'https://www.xvideos.com/c/Stepmom-371',     pages: 6 },
  // === STEPSISTER ===
  { url: 'https://www.xvideos.com/c/Step_Sister-530', pages: 6 },
  // === ARAB ===
  { url: 'https://www.xvideos.com/c/Arab-159',        pages: 5 },
  // === LATINA ===
  { url: 'https://www.xvideos.com/c/Latina-6',        pages: 6 },
  // === BIG ASS ===
  { url: 'https://www.xvideos.com/c/Big_Ass-24',      pages: 6 },
  // === BIG TITS ===
  { url: 'https://www.xvideos.com/c/Big_Tits-2',      pages: 6 },
  // === TEEN (18+) ===
  { url: 'https://www.xvideos.com/c/Teen-17',         pages: 6 },
  // === ANAL ===
  { url: 'https://www.xvideos.com/c/Anal-3',          pages: 5 },
  // === THREESOME ===
  { url: 'https://www.xvideos.com/c/Threesome-40',    pages: 5 },
  // === EBONY ===
  { url: 'https://www.xvideos.com/c/Ebony-24',        pages: 5 },
  // === ASIAN ===
  { url: 'https://www.xvideos.com/c/Asian-195',       pages: 5 },
  // === AMATEUR ===
  { url: 'https://www.xvideos.com/c/Amateur-65',      pages: 6 },
  // === HARDCORE ===
  { url: 'https://www.xvideos.com/c/Hardcore-1',      pages: 5 },
  // === LESBIAN ===
  { url: 'https://www.xvideos.com/c/Lesbian-91',      pages: 5 },
  // === DOCTOR / NURSE ===
  { url: 'https://www.xvideos.com/c/Doctor-370',      pages: 3 },
  // === MASSAGE ===
  { url: 'https://www.xvideos.com/c/Massage-155',     pages: 4 },
  // === OFFICE / BOSS ===
  { url: 'https://www.xvideos.com/c/Office-80',       pages: 3 },
];

const DELAY_MS = 550; // delay between each video fetch (ms)

// ─── EXCLUDE / CATEGORY MAPS ───────────────────────────────────────────────────
const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','x-video','porn','video','videos','hd','free',
  'raw','mms','leak','leaked','bangbros','brazzers','pervcity','houseofyre','xvid',
  'xv','adult','xxx','sex','tube','watch','full','scene','movie','clip','download',
  'online','streaming'
]);

const CATEGORY_MAP = [
  { keys: ['indian','desi','hindi','jiju','saali','bhabhi','malkin','devar','debar','nokar','punjabi','bengali','tamil','telugu'], cat: 'Indian' },
  { keys: ['stepsister','step-sister','stepsis','stepsiblings','stepdaughter','step-daughter'], cat: 'stepsister' },
  { keys: ['stepmom','step-mom','milf','mature','stepmother','cougar','stepaunt'], cat: 'MILF' },
  { keys: ['latina','colombia','venezolana','spanish','mexican','peru','argentina'], cat: 'latina' },
  { keys: ['lesbian','girlsway','girl-on-girl'], cat: 'lesbian' },
  { keys: ['anal','ass-fuck','anal-sex','analed','butt-fuck'], cat: 'anal' },
  { keys: ['asian','japanese','korean','thai','chinese','filipina'], cat: 'asian' },
  { keys: ['threesome','3some','gangbang','dp','double-penetration','group','orgy','foursome'], cat: 'threesome' },
  { keys: ['arab','arabic','hijab','muslim','egyptian','turkish','moroccan','lebanese'], cat: 'arab' },
  { keys: ['ebony','black','bbc','interracial'], cat: 'ebony' },
  { keys: ['big-ass','big-butt','booty','pawg','bubble-butt','fat-ass'], cat: 'big-ass' },
  { keys: ['big-tits','big-boobs','huge-tits','busty','large-breasts'], cat: 'big-tits' },
  { keys: ['teen','teenager','18','young','college','student'], cat: 'teen' },
  { keys: ['hardcore','rough','pounded','bdsm','dominated','rough-sex'], cat: 'hardcore' },
  { keys: ['doctor','nurse','gyno','medical','hospital'], cat: 'doctor' },
  { keys: ['massage','spa','masseuse'], cat: 'massage' },
  { keys: ['office','boss','secretary','workplace','colleague'], cat: 'office' },
];

const SEO_TEMPLATES = {
  Indian: [
    k => `Desi ${k} – Hardcore Indian Homemade XXX`,
    k => `Hot Indian ${k} – Wild Desi Fuck Session`,
    k => `Sexy ${k} Caught On Cam – Real Desi MMS`,
    k => `${k} Ki Chudai – Steamy Hindi Audio Sex Video`,
    k => `${k} Desi Romance – Passionate Indian XXX`,
  ],
  MILF: [
    k => `Horny MILF ${k} – Can't Get Enough Big Cock`,
    k => `Hot Stepmom ${k} Seduces Stepson Into Bed`,
    k => `Busty MILF ${k} Takes Hard Cock Like A Pro`,
    k => `${k} MILF – Mature Beauty's Secret Naughty Fantasy`,
    k => `Sexy ${k} Stepmom Shows Stepson What Real Sex Is`,
  ],
  stepsister: [
    k => `Naughty Stepsister ${k} Begs To Get Fucked Hard`,
    k => `${k} Stepsister Catches Stepbro Watching – Then Joins In`,
    k => `Taboo ${k} – Hot Stepsister Can't Resist Stepbrother`,
    k => `${k} Stepsis Needs A Big Cock Favor From Her Stepbro`,
    k => `Wild Stepsister ${k} – Secret Bedroom Fantasy Revealed`,
  ],
  latina: [
    k => `Spicy Latina ${k} – Fiery Passionate Fuck Session`,
    k => `Hot ${k} Latina Rides Big Cock Like A Champion`,
    k => `Curvy Latina ${k} Gets Pounded In Every Position`,
    k => `${k} Latina Takes It Deep & Loves Every Second`,
    k => `${k} – Sexy Latina Beauty's Wild Night`,
  ],
  arab: [
    k => `Sexy Arab ${k} – Hidden Desires Finally Revealed`,
    k => `${k} Hijab Beauty Gets Naughty Behind Closed Doors`,
    k => `Hot Arabic ${k} – Taboo Passion & Wild Fucking`,
    k => `${k} – Stunning Arab Babe's Secret Sex Tape`,
    k => `Forbidden Arab ${k} – Passionate Hidden Romance`,
  ],
  anal: [
    k => `${k} – Tight Ass Gets Destroyed In Hardcore Anal`,
    k => `Anal Obsessed ${k} – Deep Ass Fucking Session`,
    k => `${k} Takes Big Cock Deep In Her Perfect Tight Ass`,
    k => `First Time Anal ${k} – She Can't Believe How Good It Feels`,
    k => `${k} – Butthole Destroyed By Massive Cock Anal Fuck`,
  ],
  threesome: [
    k => `${k} – Wild Threesome Nobody Could Resist`,
    k => `Hot ${k} Threesome – Two Girls One Lucky Guy`,
    k => `${k} Group Sex – Everybody Gets What They Want`,
    k => `Steamy ${k} Threesome – Sharing Is Caring In Bed`,
    k => `${k} – DP Threesome Fantasy Becomes Reality`,
  ],
  ebony: [
    k => `${k} – Sexy Ebony Beauty Takes BBC Deep`,
    k => `Hot Ebony ${k} – Wild Interracial Fuck Session`,
    k => `${k} Ebony Babe Riding BBC Like A Pro`,
    k => `${k} – Big Black Dick Pounds Her Tight Wet Pussy`,
    k => `Gorgeous ${k} – Ebony Queen's Passionate Night`,
  ],
  'big-ass': [
    k => `${k} – Massive Booty Gets Worshipped & Destroyed`,
    k => `Thicc ${k} – Big Ass Beauty Loves Hard Doggystyle`,
    k => `${k} PAWG Takes Every Inch Deep Inside Her`,
    k => `Fat Ass ${k} – Bubble Butt Riding Session`,
    k => `${k} – Huge Ass Babe's Wild Fuck Fantasy`,
  ],
  'big-tits': [
    k => `${k} – Busty Beauty's Big Tits Bounce Hard`,
    k => `Massive Tits ${k} – She Loves Getting Her Boobs Fucked`,
    k => `${k} Busty Babe – Huge Natural Tits & Wild Riding`,
    k => `${k} – Big Boobs MILF Can't Say No`,
    k => `${k} Titty Fuck – She's Got The Biggest Rack Ever`,
  ],
  teen: [
    k => `${k} – 18yo Teen Beauty's First Wild Experience`,
    k => `Hot Teen ${k} – Young & Horny First Time`,
    k => `${k} College Teen Can't Get Enough Cock`,
    k => `Innocent ${k} Teen Goes Wild In Secret Session`,
    k => `${k} – Petite Teen Takes Huge Cock Like A Pro`,
  ],
  hardcore: [
    k => `${k} – Rough Hardcore Fuck She Won't Forget`,
    k => `Hard & Fast ${k} – No Mercy Rough Sex Session`,
    k => `${k} Gets Pounded Mercilessly In Wild Hardcore Scene`,
    k => `Dominant ${k} – Rough Fuck Until She Screams`,
    k => `${k} – Balls Deep Rough Fucking Non Stop`,
  ],
  lesbian: [
    k => `${k} – Hot Lesbian Passion Between Two Beauties`,
    k => `Sensual ${k} – Girls Making Each Other Cum`,
    k => `${k} Lesbian Fantasy – Tongue & Fingers All Night`,
    k => `${k} – Two Hot Girls Can't Keep Hands Off Each Other`,
    k => `Steamy Lesbian ${k} – Scissoring & Squirting Session`,
  ],
  asian: [
    k => `${k} – Exotic Asian Beauty's Passionate Sex Scene`,
    k => `Hot ${k} Asian Babe Rides Hard Until She Cums`,
    k => `Petite Asian ${k} Takes Big Cock In Tight Pussy`,
    k => `${k} – Japanese Cutie Gets Pounded Deep`,
    k => `${k} – Gorgeous Asian Beauty's Wild Sex Fantasy`,
  ],
  doctor: [
    k => `${k} – Horny Doctor Gives His Patient A Special Exam`,
    k => `Pervy Doctor ${k} – Medical Check Turns Into Wild Fuck`,
    k => `${k} Nurse Fantasy – Clinic Visit Gets Very Naughty`,
    k => `${k} – Doctor Prescribes Big Cock For Hot Patient`,
    k => `Secret ${k} – Doctor & Patient's Forbidden Affair`,
  ],
  massage: [
    k => `${k} – Relaxing Massage Turns Into Wild Sex Session`,
    k => `Hot ${k} – Masseuse Goes Beyond The Table`,
    k => `${k} – She Came For A Massage, Got Fucked Instead`,
    k => `${k} Happy Ending – Masseuse Gives Ultimate Relief`,
    k => `${k} – Oily Massage Leads To Passionate Fucking`,
  ],
  office: [
    k => `${k} – Boss Fucks Hot Secretary After Hours`,
    k => `Office ${k} – Naughty Colleague Gets What She Wants`,
    k => `${k} – Late Night Office Fuck Nobody Expected`,
    k => `Hot Boss ${k} – Power Play Turns Into Wild Sex`,
    k => `${k} – She Earned That Promotion On Her Knees`,
  ],
  amateur: [
    k => `${k} – Real Amateur Couple's Steamy Home Session`,
    k => `${k} Homemade – Genuine Passion Caught On Cam`,
    k => `Real ${k} – Amateur Beauty's Wild Orgasm`,
    k => `${k} – Authentic Amateur Sex Nobody Was Meant To See`,
    k => `${k} Real Homemade – No Fake Moans Just Raw Passion`,
  ],
};

const CATEGORY_TAGS = {
  Indian:    ['desi','indian','hindi','homemade','bhabhi','indian-sex'],
  MILF:      ['milf','stepmom','mature','big-tits','stepson','cougar'],
  stepsister:['stepsister','taboo','stepbrother','teen','petite','family-taboo'],
  latina:    ['latina','spanish','curvy','big-ass','passionate','exotic'],
  arab:      ['arab','hijab','muslim','arabic','exotic','middle-eastern'],
  anal:      ['anal','ass-fuck','big-ass','hardcore','creampie','tight-ass'],
  threesome: ['threesome','dp','group-sex','two-girls','big-cock','sharing'],
  ebony:     ['ebony','bbc','interracial','big-ass','black','chocolate'],
  'big-ass': ['big-ass','pawg','booty','doggystyle','curvy','bubble-butt'],
  'big-tits':['big-tits','busty','milf','natural-tits','boobs','titty-fuck'],
  teen:      ['teen','18','young','petite','college','first-time'],
  hardcore:  ['hardcore','rough','pounded','rough-sex','dominated','intense'],
  lesbian:   ['lesbian','girl-on-girl','pussy-licking','strap-on','sensual','scissoring'],
  asian:     ['asian','exotic','petite','japanese','tight','cute'],
  doctor:    ['doctor','nurse','medical','gyno','exam','clinic'],
  massage:   ['massage','oily','happy-ending','masseuse','sensual','erotic'],
  office:    ['office','boss','secretary','workplace','business','heels'],
  amateur:   ['amateur','homemade','real','couple','authentic','voyeur'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(t) {
  return t.toString().toLowerCase()
    .replace(/\s+/g,'-').replace(/[^\w\-]+/g,'')
    .replace(/\-\-+/g,'-').replace(/^-+/,'').replace(/-+$/,'');
}
function detectCategory(tags, title) {
  const s = (tags.join(' ') + ' ' + title).toLowerCase();
  for (const { keys, cat } of CATEGORY_MAP) if (keys.some(k => s.includes(k))) return cat;
  return 'amateur';
}
function extractVideoId(url) {
  const m = url.match(/\/video\.([a-z0-9]+)\//i);
  return m ? m[1] : null;
}
function generateSEOTitle(rawTitle, category) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|naughty|america|pervcity|houseofyre|promo|official|enter|free|download|watch|full)\b/gi;
  let cleaned = rawTitle
    .replace(/\s*[-|–]\s*(xvideos|hd|free|full movie).*$/i,'')
    .replace(noisy,'').replace(/[_\-#@!|]+/g,' ').replace(/\s+/g,' ').trim();
  const keyword = cleaned.split(' ').filter(w=>w.length>1).slice(0,4)
    .map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
  const tpls = SEO_TEMPLATES[category] || SEO_TEMPLATES['amateur'];
  return tpls[Math.floor(Math.random()*tpls.length)](keyword || 'Beauty');
}
function buildSEOTags(rawKeywords, category) {
  const from = rawKeywords.split(',')
    .map(k=>k.trim().toLowerCase().replace(/\s+/g,'-'))
    .filter(k=>k.length>2 && !EXCLUDE_TAGS.has(k) && !/^\d+$/.test(k))
    .slice(0,4);
  const defs = CATEGORY_TAGS[category] || CATEGORY_TAGS['amateur'];
  return [...new Set([...from,...defs])].slice(0,8);
}
function getRandomViews() {
  return ['310K','450K','620K','780K','950K','1.2M','1.6M','2.1M','2.8M','3.4M'][Math.floor(Math.random()*10)];
}
function getRandomRating() { return Math.floor(Math.random()*9)+87; }
function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

// ─── Fetch single video metadata ──────────────────────────────────────────────
async function fetchVideoMeta(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;
  try {
    const {data} = await axios.get(url, {
      timeout: 14000,
      headers: {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language':'en-US,en;q=0.9',
      }
    });
    const $ = cheerio.load(data);
    let rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';
    const rawKeywords = $('meta[name="keywords"]').attr('content') || '';
    if (!rawTitle || rawTitle.trim()==='_' || rawTitle.toLowerCase().includes('xvideos.com')) {
      const parts = url.split('/');
      rawTitle = (parts[parts.length-1]||parts[parts.length-2]||'').replace(/[_\-]+/g,' ');
    }
    const rawTags = rawKeywords.split(',').map(k=>k.trim().toLowerCase().replace(/\s+/g,'-')).filter(Boolean);
    const category = detectCategory(rawTags, rawTitle);
    const title = generateSEOTitle(rawTitle, category);
    const tags = buildSEOTags(rawKeywords, category);
    const slug = slugify(title).slice(0,90);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;
    return { title, slug, embedUrl, thumbnailUrl: thumbnail, tags, category, rating: getRandomRating(), views: getRandomViews(), dateAdded: new Date().toISOString().slice(0,10) };
  } catch { return null; }
}

// ─── Scrape one category page ─────────────────────────────────────────────────
async function scrapePageUrls(pageUrl) {
  try {
    const {data} = await axios.get(pageUrl, {
      timeout: 14000,
      headers: {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    });
    const $ = cheerio.load(data);
    const urls = [];
    $('a').each((_,el) => {
      const href = $(el).attr('href');
      if (href && /\/video\.[a-z0-9]+\//i.test(href)) {
        const abs = href.startsWith('/') ? 'https://www.xvideos.com'+href : href;
        if (!urls.includes(abs)) urls.push(abs);
      }
    });
    return urls;
  } catch { return []; }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dbPath = path.resolve(__dirname,'../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath,'utf-8'));
  const existingSlugs = new Set(existing.map(v=>v.slug));
  const existingEmbeds = new Set(existing.map(v=>v.embedUrl));

  console.log(`\n📦 Starting with ${existing.length} existing videos`);
  console.log(`🎯 Targets: ${TARGETS.length} categories\n`);
  console.log('='.repeat(60));

  const allNewEntries = [];
  let totalProcessed = 0;

  for (const target of TARGETS) {
    const baseUrl = target.url.replace(/\/\d+$/, '');
    console.log(`\n📂 CATEGORY: ${baseUrl.split('/').pop()} (${target.pages} pages)`);

    for (let page = 1; page <= target.pages; page++) {
      const pageUrl = page === 1 ? baseUrl : `${baseUrl}/${page}`;
      console.log(`  📄 Page ${page}: ${pageUrl}`);

      const videoUrls = await scrapePageUrls(pageUrl);
      if (videoUrls.length === 0) {
        console.log(`  ⚠️  No videos found or page blocked.`);
        await sleep(2000);
        continue;
      }
      console.log(`  🔍 Found ${videoUrls.length} URLs`);

      let pageAdded = 0;
      for (let i = 0; i < videoUrls.length; i++) {
        const url = videoUrls[i];
        const videoId = extractVideoId(url);
        if (!videoId) continue;
        const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;
        if (existingEmbeds.has(embedUrl)) { process.stdout.write('⏭'); continue; }

        const meta = await fetchVideoMeta(url);
        if (!meta) { process.stdout.write('✗'); continue; }

        let finalSlug = meta.slug;
        let attempt = 1;
        while (existingSlugs.has(finalSlug)) finalSlug = `${meta.slug}-${attempt++}`;
        meta.slug = finalSlug;
        existingSlugs.add(finalSlug);
        existingEmbeds.add(embedUrl);
        allNewEntries.push(meta);
        pageAdded++;
        totalProcessed++;
        process.stdout.write('✅');
        await sleep(DELAY_MS);
      }
      console.log(`\n  ✔️  Added ${pageAdded} new videos (Total new: ${allNewEntries.length})`);

      // Save progress after every page (safe checkpoint)
      if (allNewEntries.length > 0) {
        const updated = [...allNewEntries, ...existing];
        fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');
      }

      await sleep(1500); // pause between pages
    }
  }

  const finalDb = [...allNewEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(finalDb, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 DONE! Added ${allNewEntries.length} new videos.`);
  console.log(`📦 Total in database: ${finalDb.length}`);

  console.log('\n🚀 Triggering IndexNow to notify search engines...');
  exec('node scripts/indexnow.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ IndexNow trigger failed:', err);
      return;
    }
    console.log(stdout);
  });
}

main().catch(e => {
  console.error('\n❌ Fatal error:', e.message);
  process.exit(1);
});
