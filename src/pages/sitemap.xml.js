import fs from 'fs';
import path from 'path';

export async function GET() {
  // Read our centralized database.json
  const jsonPath = path.resolve('src/content/videos/database.json');
  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const videos = JSON.parse(fileData);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vixtube.net/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vixtube.net/dmca</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://vixtube.net/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://vixtube.net/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://vixtube.net/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${videos.map((video) => `
  <url>
    <loc>https://vixtube.net/videos/${video.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
