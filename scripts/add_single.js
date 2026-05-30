import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const newVideo = {
  "title": "Playing Never Have I Ever With Teen Stepsister: Vanessa Marie Wild Household Fantasy",
  "slug": "playing-never-have-i-ever-with-teen-stepsister-vanessa-marie-wild-household-fantasy",
  "embedUrl": "https://www.youporn.com/embed/205235321/",
  "thumbnailUrl": "https://fi1-ph.ypncdn.com/videos/202410/28/459724241/original/(m=eaSaaTbWx)(mh=t32Fq6qGwpI5UJGk)3.jpg",
  "tags": ["stepsister", "teen", "household-fantasy", "never-have-i-ever", "vanessa-marie", "scott-stark"],
  "category": "stepsister",
  "rating": 94,
  "views": "1.3M",
  "dateAdded": "2026-05-29"
};

const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Check for duplicate
if (existing.some(v => v.embedUrl === newVideo.embedUrl)) {
  console.log('⚠️  Already exists in database!');
  process.exit(0);
}

// Prepend (newest first)
const updated = [newVideo, ...existing];
fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');
console.log('✅ Added:', newVideo.title);
console.log('📦 Total videos:', updated.length);
