import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Environment variable containing the export URL
const CSV_EXPORT_URL = process.env.CSV_EXPORT_URL;
const TARGET_TAGS = ['tag-placeholder-1', 'tag-placeholder-2']; // User should change these
const CATEGORY = 'category-placeholder'; // User should change this
const LIMIT = 500;
const DB_PATH = path.resolve(__dirname, '../src/content/videos/database.json');

async function main() {
  if (!CSV_EXPORT_URL) {
    console.error('❌ Error: CSV_EXPORT_URL environment variable is not defined.');
    process.exit(1);
  }

  console.log(`📥 Fetching data from URL...`);
  const res = await fetch(CSV_EXPORT_URL);
  if (!res.ok) {
    console.error(`❌ Failed to fetch CSV data: ${res.statusText}`);
    process.exit(1);
  }

  let text;
  if (CSV_EXPORT_URL.endsWith('.gz')) {
    const buf = Buffer.from(await res.arrayBuffer());
    text = zlib.gunzipSync(buf).toString('utf8');
  } else {
    text = await res.text();
  }

  console.log(`📖 Reading existing database...`);
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const existing = new Set(db.map(v => v.embedUrl));
  const existingSlugs = new Set(db.map(v => v.slug));

  console.log(`🔍 Parsing and filtering CSV rows...`);
  const rows = text.split('\n').map(parseCsvRow).filter(Boolean);

  const matches = [];
  for (const r of rows) {
    if (matches.length >= LIMIT) break;

    // Check if it matches target tags and is not already in the database
    const hasTag = TARGET_TAGS.some(t => r.tags.toLowerCase().includes(t.toLowerCase()));
    if (hasTag && !existing.has(r.embedUrl)) {
      let finalSlug = slugify(r.title);
      let attempt = 1;
      while (existingSlugs.has(finalSlug)) {
        finalSlug = `${slugify(r.title)}-${attempt++}`;
      }
      existingSlugs.add(finalSlug);

      matches.push({
        title: r.title,
        slug: finalSlug,
        embedUrl: r.embedUrl,
        thumbnailUrl: r.thumbnailUrl,
        tags: r.tags.split(';').map(t => t.trim()).filter(Boolean),
        category: CATEGORY,
        rating: r.rating ?? (Math.floor(Math.random() * 10) + 88), // 88 - 97
        views: r.views ?? `${Math.floor(Math.random() * 800) + 100}K`, // Random view count string (e.g. "450K")
        dateAdded: new Date().toISOString().slice(0, 10),
      });
    }
  }

  if (matches.length === 0) {
    console.log('ℹ️ No new matching videos found to import.');
    return;
  }

  // Save the updated database
  console.log(`💾 Writing ${matches.length} new entries to database...`);
  const updatedDb = [...matches, ...db];
  fs.writeFileSync(DB_PATH, JSON.stringify(updatedDb, null, 2), 'utf8');
  console.log(`🎉 Done! Successfully imported ${matches.length} videos into category "${CATEGORY}"`);
}

function parseCsvRow(line) {
  if (!line.trim()) return null;
  
  // Split columns by semicolon (adjust if the feed uses commas or tabs)
  const cols = line.split(';'); 
  if (cols.length < 4) return null;

  return {
    embedUrl: extractIframeSrc(cols[0]),  // Column 1: Embed code / Iframe
    thumbnailUrl: cols[1],                // Column 2: Thumbnail URL
    title: cols[2],                       // Column 3: Title
    tags: cols[3] ?? '',                  // Column 4: Tags
    views: cols[4] ? parseViews(cols[4]) : undefined,
    rating: cols[5] ? parseInt(cols[5], 10) : undefined,
  };
}

function extractIframeSrc(embedCode) {
  if (!embedCode) return '';
  const m = embedCode.match(/src=["']([^"']+)["']/);
  return m ? m[1] : embedCode;
}

function parseViews(viewVal) {
  const num = parseInt(viewVal, 10);
  if (isNaN(num)) return undefined;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return num.toString();
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 90);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
