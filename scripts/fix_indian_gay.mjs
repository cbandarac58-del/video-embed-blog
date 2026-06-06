import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

// ─── Keywords that clearly indicate GAY content ───────────────────────────────
const GAY_TITLE_KEYWORDS = [
  'jordan levine','vadim black','vadim','marcos goiano','ryan cage',
  'noah jones','griffin barrows','cliff jensen','brandon evans','aspen',
  'noirmale','bearfilms','wolf lance','charger','diego sans','brad',
  'menzorra','jordan boss','shane jackson','men.com','mencom',
  'men-on-men','gay','homo','twink','bareback','bear film','bear films',
  'buck angel','men fucking men','male on male','man on man'
];

const GAY_TAG_KEYWORDS = [
  'gay','homo','twink','bareback','bear','men-fucking',
  'gay-porn','gay-sex','gay-anal','gay-blowjob','gay-amateur',
  'male','men.com','noirmale','bearfilms'
];

let movedToGay = 0;
let keptIndian = 0;

db.forEach(v => {
  if (v.category !== 'Indian') return;

  const titleLower = v.title.toLowerCase();
  const tagStr = (v.tags || []).join(' ').toLowerCase();
  const combined = titleLower + ' ' + tagStr;

  const isGay = GAY_TITLE_KEYWORDS.some(k => combined.includes(k)) ||
                GAY_TAG_KEYWORDS.some(k => tagStr.split(/[\s,]+/).includes(k));

  if (isGay) {
    v.category = 'Gay';
    movedToGay++;
  } else {
    keptIndian++;
  }
});

writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

console.log('\n✅ Indian Category Cleanup Done!');
console.log('─'.repeat(40));
console.log(`🏳️‍🌈 Moved to Gay:      ${movedToGay} videos`);
console.log(`🇮🇳 Kept in Indian:    ${keptIndian} videos`);
console.log(`📦 Gay total now:      ${db.filter(v=>v.category==='Gay').length} videos`);
console.log(`📦 Indian total now:   ${db.filter(v=>v.category==='Indian').length} videos`);
