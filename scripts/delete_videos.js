import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SLUGS_TO_DELETE = [
  '2000-couple-sri-lankan-girls-sex',
  'best-friends-wife-told-me-to-take-the-condom-off-sri-lanka-creampie',
  'hard-fucked-friends-beautiful-girlfriend-at-house-party-sri-lanka',
  'lanka-desi-babe-fill-up-my-mom-voluptuous-spanish-stepmom-queen-rogue-makes-step',
  'perfect-ass-sexy-roommate-got-the-best-wake-up-ever-sri-lanka',
  'romantic-fuck-with-gorgeous-sri-lankan-girl-and-become-happy-ending-night',
  'sharing-a-bed-with-my-sri-lankan-best-friend-fuck-hard',
  'sinhala-leaked-mms-18-cute-asian-girl-tight-pussy-fucking-video',
  'sinhala-leaked-mms-ex-girlfriend-suck-my-cock-cum-drinking',
  'sinhala-leaked-mms-showing-the-package-perfect-that-you-ordered-baby',
  'sri-lankan-amateur-srilanka-hot-lady-treatment',
  'sri-lankan-beautiful-village-girl-fucking',
  'sri-lankan-hot-babe-19-years-old-cute-girl-first-time-fuck-with-stepbro',
  'sri-lankan-hot-cheating-wife-sex',
  'sri-lankan-hot-girls',
  'sri-lankan-office-girl-cheating-her-husband-anal-fuck-sinhala',
  'sri-lankan-stepsister-fucked-by-stepbrother',
  'sri-lankan-very-beautiful-village-girl-fuck-cum-inside-pussy',
];

const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

console.log(`\n📦 Total before: ${db.length}`);
console.log(`🗑️  Deleting ${SLUGS_TO_DELETE.length} videos...\n`);

const slugSet = new Set(SLUGS_TO_DELETE);
let deletedCount = 0;

const filtered = db.filter(v => {
  if (slugSet.has(v.slug)) {
    console.log(`  🗑️  Deleted: "${v.title.slice(0, 60)}"`);
    deletedCount++;
    return false;
  }
  return true;
});

// Check for any not found
const foundSlugs = new Set(db.map(v => v.slug));
SLUGS_TO_DELETE.forEach(slug => {
  if (!foundSlugs.has(slug)) {
    console.log(`  ⚠️  Not found in DB: ${slug}`);
  }
});

fs.writeFileSync(dbPath, JSON.stringify(filtered, null, 2), 'utf-8');

console.log(`\n✅ Deleted: ${deletedCount} videos`);
console.log(`📦 Total after: ${filtered.length}`);
