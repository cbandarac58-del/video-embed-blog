import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const allVideos = await getCollection('videos');

  // 1. අලුතෙන්ම එකතු වූ Videos 200 තෝරාගැනීම (dateAdded අනුව Sort කර)
  const latestVideos = allVideos
    .sort((a, b) => new Date(b.data.dateAdded).getTime() - new Date(a.data.dateAdded).getTime())
    .slice(0, 200);

  const DOMAIN = 'https://vixtube.net';

  // 2. XML Dynamic Structure එක සෑදීම
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${latestVideos
    .map((video) => {
      const date = new Date(video.data.dateAdded).toISOString();
      return `
    <url>
      <loc>${DOMAIN}/videos/${video.data.slug}</loc>
      <lastmod>${date}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`;
    })
    .join('')}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cloudflare CDN Caching
    },
  });
};
