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

// Standard categories to map randomly if a video has none
const CATEGORIES = ['Amateur', 'P.O.V.', 'Hardcore', 'Blowjob', 'Lesbian', 'MILF', 'Brunette', 'Compilation', 'Reality'];

// Generate simulated tags if not present
const SAMPLE_TAGS = ['hot', 'sex', 'sexy', 'hardcore', 'pov', 'amateur', 'babe', 'mature', 'teen', 'milf', 'bigtits', 'couples'];

// Standard User-Agent to bypass simple anti-bot systems
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9'
};

/**
 * Scrapes XVideos HTML trending list
 */
async function scrapeXVideos() {
  console.log("Attempting to crawl XVideos Trending HTML...");
  const targetUrl = 'https://www.xvideos.com/';
  const response = await axios.get(targetUrl, { headers: HEADERS, timeout: 15000 });
  const $ = cheerio.load(response.data);
  const items = [];

  $('.mozaique .thumb-block').each((i, el) => {
    if (i >= 15) return; // Limit to 15 items per batch
    
    const title = $(el).find('p.title a').attr('title');
    const pageUrl = $(el).find('p.title a').attr('href');
    const viewsText = $(el).find('.metadata').text() || '';

    if (!title || !pageUrl) return;

    // Extract XVideos video id to build embed URL
    // URL structure e.g. /video123456/title
    const idMatch = pageUrl.match(/\/video(\d+)\//);
    const videoId = idMatch ? idMatch[1] : null;
    if (!videoId) return;

    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    // Extract views count
    let views = Math.floor(Math.random() * 2000000) + 150000;
    const viewsMatch = viewsText.match(/([\d\.]+)(M|k)/i);
    if (viewsMatch) {
      const num = parseFloat(viewsMatch[1]);
      const multiplier = viewsMatch[2].toLowerCase() === 'm' ? 1000000 : 1000;
      views = Math.floor(num * multiplier);
    }

    const rating = Math.floor(Math.random() * 15) + 82; // 82% to 97%
    
    // Choose random tags
    const tags = Array.from({ length: 3 }, () => SAMPLE_TAGS[Math.floor(Math.random() * SAMPLE_TAGS.length)]);
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    items.push({
      title,
      embedUrl,
      views,
      rating,
      category,
      tags,
      dateAdded: new Date().toISOString().split('T')[0]
    });
  });

  return items;
}

/**
 * Parses Pornhub Public RSS feeds
 */
async function scrapePornhubRSS() {
  console.log("Attempting to scrape Pornhub RSS feed...");
  const rssUrl = 'https://www.pornhub.com/active/rss';
  const response = await axios.get(rssUrl, { headers: HEADERS, timeout: 15000 });
  const $ = cheerio.load(response.data, { xmlMode: true });
  const items = [];

  $('item').each((i, el) => {
    if (i >= 15) return; // Limit to 15 items per batch
    
    const title = $(el).find('title').text();
    const link = $(el).find('link').text();
    const description = $(el).find('description').text();

    if (!title || !link) return;

    // Parse the embed code from description if possible
    let embedUrl = '';
    const iframeMatch = description.match(/src="([^"]+)"/);
    if (iframeMatch) {
      embedUrl = iframeMatch[1];
    } else {
      // Build embedURL from standard page url:
      // pageUrl: https://www.pornhub.com/view_video.php?viewkey=ph5a...
      const urlObj = new URL(link);
      const viewkey = urlObj.searchParams.get('viewkey');
      if (viewkey) {
        embedUrl = `https://www.pornhub.com/embed/${viewkey}`;
      } else {
        return; // Skip if no embed url possible
      }
    }

    // Default metrics
    const views = Math.floor(Math.random() * 1800000) + 120000;
    const rating = Math.floor(Math.random() * 16) + 83; // 83% to 98%
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const tags = Array.from({ length: 3 }, () => SAMPLE_TAGS[Math.floor(Math.random() * SAMPLE_TAGS.length)]);

    items.push({
      title,
      embedUrl,
      views,
      rating,
      category,
      tags,
      dateAdded: new Date().toISOString().split('T')[0]
    });
  });

  return items;
}

/**
 * Fallback Mock Data Generator (Used when Cloudflare/Captchas block scraper commands)
 */
function getMockData() {
  console.log("⚠️ IP blocked or rate-limited. Falling back to dynamic mock aggregate list for template verification...");
  
  const mockTitles = [
    "Hot Amateur Couples POV Romance compilation",
    "Extreme Reality Audition Room episode 45",
    "Outdoor Camping Sensation with Gorgeous MILF",
    "Busty Brunette Secretary Boss Office Encounter",
    "Romantic Spa Massage Treatment Compilation",
    "Young Babe Beach Vacation Vacationers POV",
    "Exquisite Hardcore Passionate Evening Stream",
    "Lesbian Bathhouse Relaxation and Playtime",
    "Sneaky Step-sister Bedtime Confessions Episode 2",
    "Trending Daily Top Viral Clip Collection 2026"
  ];

  const embedFallbacks = [
    "https://www.pornhub.com/embed/ph5f865f3d45678",
    "https://www.pornhub.com/embed/ph5e723ab81cd3f",
    "https://www.xvideos.com/embedframe/5432109",
    "https://www.xvideos.com/embedframe/9876543",
  ];

  return mockTitles.map((title, i) => {
    const slug = slugify(title);
    return {
      title,
      embedUrl: embedFallbacks[i % embedFallbacks.length],
      views: Math.floor(Math.random() * 3000000) + 200000,
      rating: Math.floor(Math.random() * 12) + 86, // 86% to 97%
      category: CATEGORIES[i % CATEGORIES.length],
      tags: [
        SAMPLE_TAGS[i % SAMPLE_TAGS.length],
        SAMPLE_TAGS[(i + 2) % SAMPLE_TAGS.length],
        SAMPLE_TAGS[(i + 4) % SAMPLE_TAGS.length],
      ],
      dateAdded: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // sequential dates
    };
  });
}

// Main execution process
async function run() {
  console.log("=== Launching Adult Video Embed Scraper ===");
  let items = [];

  try {
    // 1. Try XVideos Scraper
    items = await scrapeXVideos();
  } catch (err) {
    console.warn(`XVideos crawl failed (${err.message}). Trying Pornhub RSS feed...`);
    try {
      // 2. Try Pornhub RSS Scraper
      items = await scrapePornhubRSS();
    } catch (rssErr) {
      console.warn(`Pornhub RSS scrape failed (${rssErr.message}).`);
      // 3. Fallback to high-quality Mock list
      items = getMockData();
    }
  }

  console.log(`Scraped/Generated ${items.length} items. Saving to content layer...`);
  let addedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    const slug = slugify(item.title);
    const fileName = `${slug}.json`;
    const filePath = path.join(CONTENT_DIR, fileName);

    const fileContent = {
      title: item.title,
      slug: slug,
      embedUrl: item.embedUrl,
      tags: item.tags,
      category: item.category,
      rating: item.rating,
      views: item.views,
      dateAdded: item.dateAdded
    };

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
      console.log(`+ Created post: ${fileName}`);
      addedCount++;
    } else {
      console.log(`~ Skipped (Already exists): ${fileName}`);
      skippedCount++;
    }
  }

  console.log(`=== Scraper Complete. Added: ${addedCount}, Skipped: ${skippedCount} ===`);
}

run();
