/**
 * seo_enhance.js
 * Generates SEO descriptions (50-60 words) + 20 LSI keyword tags for all videos.
 * Run: node scripts/seo_enhance.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '../src/content/videos/database.json');

// ─── LSI Keyword Banks per Category ──────────────────────────────────────────
const LSI_BANKS = {
  'Sri Lankan': [
    'sri-lankan','ceylon','sinhala','lankan-girl','colombo','kandy','sl-babe',
    'local-sex','lanka-xxx','sl-mms','sinhala-xxx','sl-couple','local-babe',
    'sl-teen','lankan-xxx','ceylon-sex','sl-homemade','sl-nude','lankan-hot','sl-girl'
  ],
  'Indian': [
    'desi','bhabhi','hindi','indian-sex','indian-babe','desi-porn','hindi-audio',
    'indian-homemade','desi-xxx','indian-wife','rajasthani','punjabi','tamil','telugu',
    'bengali','desi-bhabhi','indian-mms','desi-couple','indian-amateur','hindustani'
  ],
  'MILF': [
    'milf','stepmom','mature','stepmother','cougar','mom-sex','older-woman',
    'mature-woman','mommy','stepmom-xxx','hot-mom','sexy-mom','milf-porn',
    'mature-sex','milf-blowjob','busty-milf','milf-creampie','milf-amateur',
    'milf-homemade','mature-blonde'
  ],
  'stepsister': [
    'stepsister','stepsis','step-sister','stepbrother','taboo','family-taboo',
    'step-siblings','pov-stepsister','stepbro','stepsister-caught','naughty-stepsister',
    'taboo-sex','forbidden','stepfamily','step-fantasy','real-stepsister',
    'teen-stepsister','hot-stepsister','stepsister-creampie','stepsister-blowjob'
  ],
  'latina': [
    'latina','spanish','colombiana','mexican','venezolana','argentina','peruana',
    'latina-sex','latin-girl','curvy-latina','sexy-latina','latina-amateur',
    'latina-babe','latina-porn','latina-creampie','latina-teen','hot-latina',
    'latina-milf','latina-homemade','hispanic'
  ],
  'asian': [
    'asian','japanese','korean','thai','chinese','filipina','vietnamese',
    'asian-babe','asian-teen','asian-amateur','asian-xxx','jav','asian-beauty',
    'asian-girl','petite-asian','asian-sex','asian-porn','asian-creampie',
    'asian-blowjob','exotic-asian'
  ],
  'ebony': [
    'ebony','bbc','black-girl','interracial','ebony-babe','ebony-teen','black-sex',
    'ebony-amateur','ebony-milf','ebony-xxx','black-beauty','ebony-creampie',
    'ebony-blowjob','ebony-homemade','chocolate','dark-skin','ebony-lesbian',
    'ebony-porn','black-pussy','afro'
  ],
  'anal': [
    'anal','anal-sex','ass-fuck','anal-creampie','anal-teen','anal-milf',
    'anal-amateur','first-anal','anal-hardcore','butt-fuck','backdoor','ass-to-mouth',
    'anal-pov','anal-threesome','deep-anal','anal-orgasm','tight-ass','anal-blonde',
    'anal-brunette','anal-dp'
  ],
  'teen': [
    'teen','18-year-old','young','college-girl','petite-teen','teen-xxx',
    'teen-amateur','teen-sex','teen-blowjob','teen-creampie','teen-babe',
    'teen-homemade','first-time','innocent','teen-lesbian','teen-anal',
    'teen-milf','sexy-teen','hot-teen','college-sex'
  ],
  'MILF / Mature': [
    'milf','mature','stepmom','cougar','older-woman','mom-sex','mature-sex',
    'milf-porn','busty-milf','mature-amateur','milf-blowjob','milf-creampie',
    'hot-mom','sexy-mom','milf-teen','mature-blonde','mature-brunette',
    'milf-lesbian','milf-homemade','mature-couple'
  ],
  'threesome': [
    'threesome','3some','dp','double-penetration','two-girls','group-sex',
    'mmf','ffm','orgy','foursome','gang-bang','sharing','bisexual-threesome',
    'teen-threesome','milf-threesome','latina-threesome','anal-threesome',
    'amateur-threesome','threesome-creampie','hot-threesome'
  ],
  'hardcore': [
    'hardcore','rough-sex','rough','pounding','doggystyle','pov','bdsm',
    'dominated','rough-blowjob','spanking','choking','slapping','rough-anal',
    'rough-teen','hardcore-sex','intense','power-fuck','wild-sex',
    'rough-amateur','extreme'
  ],
  'lesbian': [
    'lesbian','girl-on-girl','pussy-licking','cunnilingus','strap-on','scissoring',
    'lesbian-teen','lesbian-milf','lesbian-amateur','lesbian-babe','girl-kiss',
    'lesbian-threesome','lesbian-xxx','sapphic','tribbing','lesbian-creampie',
    'lesbian-squirt','lesbian-orgasm','hot-lesbian','lesbian-homemade'
  ],
  'amateur': [
    'amateur','homemade','real-sex','couple','real-amateur','authentic',
    'real-orgasm','hidden-cam','voyeur','wife','girlfriend','real-couple',
    'amateur-blowjob','amateur-creampie','amateur-teen','amateur-milf',
    'real-homemade','casting','first-time','amateur-porn'
  ],
  'big-tits': [
    'big-tits','busty','huge-boobs','large-breasts','big-boobs','massive-tits',
    'natural-tits','fake-tits','big-tit-milf','busty-teen','busty-babe',
    'titty-fuck','big-tit-blowjob','busty-amateur','big-tit-latina',
    'busty-asian','big-tit-ebony','busty-brunette','big-natural-tits','breast'
  ],
  'big-ass': [
    'big-ass','pawg','booty','bubble-butt','fat-ass','thick','curvy','big-butt',
    'ass-worship','doggystyle','spank','booty-shake','twerking','booty-call',
    'round-ass','big-booty-latina','big-ass-milf','big-ass-teen',
    'big-ass-ebony','phat-ass'
  ],
  'arab': [
    'arab','hijab','muslim','arabic','middle-eastern','egyptian','moroccan',
    'turkish','lebanese','saudi','arab-babe','arab-teen','hijab-sex',
    'arab-milf','arab-amateur','arabic-sex','arab-homemade','arab-creampie',
    'arab-blowjob','forbidden-arab'
  ],
  'Doctor / Gyno': [
    'doctor','gyno','nurse','clinic','medical','patient','examination',
    'gyno-exam','doctor-sex','nurse-sex','hospital','stethoscope','uniform',
    'doctor-patient','medical-fetish','clinic-sex','gyno-fuck','sexy-nurse',
    'doctor-blowjob','medical-porn'
  ],
};

// Description templates per category
const DESC_TEMPLATES = {
  'Sri Lankan': [
    (t, tags) => `Watch this steamy Sri Lankan homemade sex video featuring ${t}. This authentic Ceylon couple captures raw, unfiltered passion with explicit scenes. Perfect for fans of real desi content, local Sri Lankan MMS leaks, and genuine amateur adult entertainment from South Asia. Stream free HD quality now.`,
    (t, tags) => `Hot Sri Lankan babe in this exclusive local MMS video. Enjoy this genuine Ceylon homemade clip showing real amateur passion. If you love authentic desi sex tapes, Lankan girl nude content, and uncensored local adult videos, this is exactly what you've been searching for online.`,
  ],
  'Indian': [
    (t, tags) => `Desi bhabhi sex video featuring ${t}. This authentic Indian homemade clip captures real passion with clear Hindi audio moaning. Ideal for fans of desi bhabhi porn, Indian MMS leaks, and real amateur Indian sex tapes. Enjoy genuine South Asian adult content in full HD quality streaming.`,
    (t, tags) => `Watch ${t} in this hot Indian XXX video. Real desi couple caught on camera in their steamy bedroom session. Perfect for lovers of Hindi porn, desi bhabhi sex, Indian wife caught cheating, and authentic amateur Indian adult content. Streaming free with no registration required.`,
  ],
  'MILF': [
    (t, tags) => `Sexy MILF ${t} shows why older women are hotter than ever. This horny stepmom can't resist temptation and gets exactly what she craves. Perfect for fans of mature woman porn, MILF sex tapes, hot stepmom videos, and older women who love younger men. HD streaming free.`,
    (t, tags) => `Hot mature stepmom in ${t} takes control and gets what she wants. Busty MILF with experience teaches the young guy everything about real pleasure. Fans of cougar porn, mature woman sex, stepmom taboo videos, and sexy older women will absolutely love this steamy explicit scene.`,
  ],
  'stepsister': [
    (t, tags) => `Naughty stepsister caught in ${t} can't resist her stepbrother's big cock. This hot taboo family fantasy video shows exactly what happens behind closed doors. Perfect for fans of stepsister porn, taboo family sex, stepsibling fantasies, and forbidden desire adult videos. Watch free HD now.`,
    (t, tags) => `Sexy stepsister in ${t} sneaks into stepbrother's room for the ultimate forbidden fantasy. Watch this popular taboo video that explores steamy stepsister desires. Fans of family taboo porn, naughty stepsis content, forbidden stepsibling sex, and popular fantasy videos will love this scene.`,
  ],
  'latina': [
    (t, tags) => `Fiery Latina beauty ${t} brings passionate energy to every steamy scene. This curvy Colombian goddess takes big cock with enthusiasm and loves every second. Perfect for fans of Latina porn, Spanish sex videos, curvy girl content, and passionate South American adult entertainment streaming free.`,
    (t, tags) => `Hot Latina in ${t} shows why Latin women are the world's most passionate lovers. This sexy Colombian babe rides hard with wild enthusiasm. Fans of Latina sex, Spanish XXX videos, curvy girl porn, Venezuelan beauties, and spicy adult content will absolutely love this sizzling scene.`,
  ],
  'asian': [
    (t, tags) => `Beautiful Asian woman ${t} in this stunning explicit video showcasing exotic Eastern passion. This petite Japanese beauty takes it deep with quiet moaning and wild intensity. Perfect for fans of Asian porn, Japanese sex videos, Korean adult content, JAV enthusiasts, and exotic Asian amateur videos.`,
    (t, tags) => `Gorgeous Asian babe in ${t} delivers breathtaking explicit content with natural beauty and passionate intensity. This petite exotic girl knows exactly how to please. Ideal for fans of Asian amateur porn, Japanese adult content, Korean sex tapes, Thai girls, and Chinese beauty adult videos online.`,
  ],
  'ebony': [
    (t, tags) => `Gorgeous ebony babe ${t} takes massive BBC in this explosive interracial video. This beautiful black queen shows off her curves while getting exactly what she desires. Fans of ebony porn, BBC sex videos, interracial adult content, and black girl explicit videos will love every hot second.`,
    (t, tags) => `Sexy black beauty in ${t} demonstrates why ebony women are so incredibly desirable. This hot African American babe handles big cock like a seasoned pro. Perfect for fans of ebony sex, interracial porn, BBC videos, dark-skinned beauties, and explicit black girl adult entertainment streaming free.`,
  ],
  'anal': [
    (t, tags) => `Tight asshole destroyed in ${t} as this hot babe takes anal like a champion. Watch this explicit hardcore anal sex scene with deep penetration and intense moaning. Perfect for fans of anal porn, first-time anal videos, anal creampie content, and hardcore ass-fucking adult entertainment in HD.`,
    (t, tags) => `This hot babe in ${t} gets her perfect tight ass destroyed by massive cock in incredible anal sex scene. She takes every inch deep with moaning pleasure. Ideal for anal porn fans, hardcore backdoor sex enthusiasts, anal creampie lovers, and deep penetration adult content streaming free HD.`,
  ],
  'teen': [
    (t, tags) => `Hot 18-year-old babe in ${t} experiences wild pleasure for the first time. This petite college teen can't get enough of big cock action. Perfect for legal teen porn fans, college girl sex videos, young amateur adult content, petite girl explicit scenes, and first-time sex video enthusiasts online.`,
    (t, tags) => `Sexy barely legal teen in ${t} gets her tight pussy pounded deep in this explicit scene. This innocent college girl goes absolutely wild during intense sex session. Fans of legal teen porn, 18-year-old amateur videos, college sex tapes, petite girl content, and young adult XXX will love this.`,
  ],
  'threesome': [
    (t, tags) => `Wild threesome in ${t} features two hot babes sharing one lucky guy in explosive group sex action. This explicit MMF threesome video delivers non-stop pleasure from all angles. Perfect for fans of threesome porn, group sex videos, FFM content, double penetration, and hot sharing adult entertainment.`,
    (t, tags) => `Two sexy girls and one big cock make ${t} an unforgettable group sex experience. This steamy threesome video captures raw energy and passionate group action. Fans of MMF threesome porn, group sex videos, double blowjob content, sharing is caring adult videos, and hot trio sex will love it.`,
  ],
  'hardcore': [
    (t, tags) => `Intense hardcore pounding in ${t} shows rough sex at its absolute finest. This wild explicit scene features relentless deep thrusting and passionate screaming. Perfect for fans of rough sex porn, hardcore video content, intense fucking, dominant sex scenes, and wild rough adult entertainment streaming free HD.`,
    (t, tags) => `No mercy hardcore action in ${t} as this babe takes rough pounding she can't forget. Wild intense sex scene with deep penetration and dominant fucking. Ideal for rough sex fans, hardcore porn enthusiasts, BDSM-adjacent content lovers, intense fucking video seekers, and dominant adult entertainment streaming online.`,
  ],
  'lesbian': [
    (t, tags) => `Two sexy lesbian babes in ${t} explore passionate girl-on-girl desire with tongue and fingers. This explicit lesbian video features pussy licking, scissoring, and intense female orgasms. Perfect for fans of lesbian porn, girl-on-girl content, sapphic erotica, lesbian threesome videos, and female pleasure adult streaming.`,
    (t, tags) => `Hot lesbian couple in ${t} can't keep their hands off each other in this sensual explicit video. Watch passionate girl-on-girl action with real female orgasms. Fans of lesbian sex videos, pussy licking porn, sapphic adult content, strap-on videos, and beautiful women together will adore this scene.`,
  ],
  'amateur': [
    (t, tags) => `Real amateur couple caught on camera in ${t} sharing genuine passionate home sex. This authentic homemade video captures raw intimacy with no fake moaning. Perfect for fans of real amateur porn, homemade sex tapes, couple videos, authentic adult content, and genuine voyeur-style explicit home recording.`,
    (t, tags) => `Genuine homemade sex in ${t} shows real couple's passionate intimate bedroom session. This authentic amateur video has no actors — just real people enjoying real pleasure. Fans of homemade porn, genuine amateur sex tapes, real couple videos, and authentic adult content will absolutely love this raw scene.`,
  ],
  'Doctor / Gyno': [
    (t, tags) => `Naughty doctor sex in ${t} shows what really happens in the private examination room. This explicit medical fantasy video features a horny doctor and willing patient. Perfect for fans of doctor porn, nurse sex videos, medical fetish adult content, gyno exam erotica, and uniform-based explicit fantasies.`,
    (t, tags) => `Sexy nurse and naughty doctor in ${t} turn a routine clinic visit into wild explicit sex session. This medical fantasy video delivers steamy uniform action. Ideal for fans of doctor patient porn, nurse sex tapes, medical fetish adult content, hospital sex videos, and explicit clinic fantasy streaming.`,
  ],
};

// LSI Keyword expansion per category + from title
function getLSIKeywords(category, existingTags, title) {
  const bank = LSI_BANKS[category] || LSI_BANKS['amateur'];
  
  // Parse title for keywords
  const titleWords = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .map(w => w.replace(/\s+/g, '-'))
    .slice(0, 5);

  // Start with existing tags (cleaned)
  const cleanExisting = existingTags
    .map(t => t.toLowerCase().trim().replace(/\s+/g, '-'))
    .filter(t => t.length > 2);

  // Combine: existing + title words + bank keywords
  const combined = [...new Set([...cleanExisting, ...titleWords, ...bank])];
  
  // Return exactly 20
  return combined.slice(0, 20);
}

// Generate description
function generateDescription(video) {
  const { title, category, tags } = video;
  const cat = category || 'amateur';
  
  // Get templates for this category (fall back to amateur)
  const templates = DESC_TEMPLATES[cat] || DESC_TEMPLATES['amateur'];
  
  // Pick template based on slug hash for consistency
  const hash = video.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const template = templates[hash % templates.length];
  
  // Get short title for use in template
  const shortTitle = title
    .replace(/\s*[-–|]\s*(xvideos|pornhub|hd|free|full).*$/i, '')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join(' ');

  let desc = template(shortTitle, tags);
  
  // Ensure 50-60 words
  const words = desc.split(/\s+/);
  if (words.length > 65) {
    desc = words.slice(0, 60).join(' ') + '.';
  }
  
  return desc;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 SEO Enhancement Script Starting...\n');
  
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  console.log(`📦 Total videos: ${db.length}`);
  
  let enhanced = 0;
  let skipped = 0;
  
  const updated = db.map((video, i) => {
    // Skip if already has good description (>30 chars) and 15+ tags
    const hasDesc = video.description && video.description.length > 30;
    const hasManyTags = (video.tags || []).length >= 15;
    
    if (hasDesc && hasManyTags) {
      skipped++;
      return video;
    }
    
    // Generate description if missing
    const description = hasDesc ? video.description : generateDescription(video);
    
    // Expand tags to 20 LSI keywords
    const tags = hasManyTags ? video.tags : getLSIKeywords(
      video.category || 'amateur',
      video.tags || [],
      video.title || ''
    );
    
    if (i % 100 === 0) {
      process.stdout.write(`  ✏️  Processing ${i + 1}/${db.length}...\r`);
    }
    
    enhanced++;
    return { ...video, description, tags };
  });
  
  console.log(`\n✅ Enhanced: ${enhanced} videos`);
  console.log(`⏭️  Skipped (already complete): ${skipped} videos`);
  
  fs.writeFileSync(DB_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`\n💾 Saved to database.json`);
  console.log('🎉 SEO enhancement complete!');
}

main().catch(e => console.error('❌ Error:', e.message));
