import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory paths in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define content directories
const CONTENT_DIR = path.join(__dirname, '../src/content/videos');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Helper to sanitize title into url slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// Target public feed
const FEED_URL = 'https://news.google.com/rss';

async function run() {
  console.log("=== Launching Public Media RSS Scraper ===");
  try {
    console.log(`Fetching feed from: ${FEED_URL}`);
    const response = await axios.get(FEED_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    // Load XML content using Cheerio
    const $ = cheerio.load(response.data, { xmlMode: true });
    const items = [];

    $('item').each((i, el) => {
      if (i >= 12) return; // Limit to 12 items

      const title = $(el).find('title').text();
      const link = $(el).find('link').text();
      const pubDate = $(el).find('pubDate').text() || new Date().toUTCString();

      if (title && link) {
        const slug = slugify(title);
        // We map the embed URL to a standard safe embed player for demonstration
        const embedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; 

        items.push({
          title,
          slug,
          embedUrl,
          tags: ['news', 'update', 'media'],
          category: 'World',
          rating: Math.floor(Math.random() * 15) + 85, // 85% to 99%
          views: Math.floor(Math.random() * 500000) + 10000,
          dateAdded: new Date(pubDate).toISOString().split('T')[0]
        });
      }
    });

    console.log(`Scraped/Generated ${items.length} items. Saving to content layer...`);
    let addedCount = 0;

    for (const item of items) {
      const fileName = `${item.slug}.json`;
      const filePath = path.join(CONTENT_DIR, fileName);

      fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
      console.log(`+ Created post: ${fileName}`);
      addedCount++;
    }

    console.log(`=== Scraper Complete. Saved: ${addedCount} entries ===`);

  } catch (error) {
    console.error('An error occurred during RSS scrape:', error.message);
  }
}

run();
