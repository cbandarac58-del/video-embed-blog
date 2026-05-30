import fs from 'fs';
import path from 'path';

const API_KEY = "57ca8bd187e1a384849206b0266da5cf";
const HOST = "vixtube.net";
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

// Read sitemap urls or database
async function getUrls() {
  const jsonPath = path.resolve('src/content/videos/database.json');
  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const videos = JSON.parse(fileData);

  const urls = [
    `https://${HOST}/`,
    `https://${HOST}/popular`,
    `https://${HOST}/featured`
  ];

  // Add categories
  const categories = [...new Set(videos.map(v => v.category))].filter(Boolean);
  categories.forEach(cat => {
    const slug = cat.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    urls.push(`https://${HOST}/category/${slug}`);
  });

  // Add top 100 videos
  videos.slice(0, 100).forEach(v => {
    urls.push(`https://${HOST}/videos/${v.slug}`);
  });

  return urls;
}

async function pingIndexNow() {
  const urlList = await getUrls();
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  const payload = {
    host: HOST,
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  };

  const endpoints = [
    "https://api.indexnow.org", // Main IndexNow aggregator (distributes to Bing, Yandex, Seznam, etc.)
    "https://www.bing.com",
    "https://yandex.com"
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${endpoint}/indexnow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log(`✅ IndexNow submission successful for: ${endpoint}`);
      } else {
        console.error(`❌ IndexNow submission failed for: ${endpoint} (Status: ${response.status})`);
      }
    } catch (e) {
      console.error(`❌ Error pinging ${endpoint}:`, e.message);
    }
  }
}

pingIndexNow();
