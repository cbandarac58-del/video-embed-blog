import { getCollection } from 'astro:content';

export async function GET(context: any) {
  // Query all video records to make sitemap entries dynamic
  let videos = [];
  try {
    videos = await getCollection('videos');
  } catch (e) {
    console.error("Sitemap collection fetch failed: ", e);
  }

  const siteUrl = context.site || 'https://vixtube.com';

  // Construct XML response string
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Dynamic Video Pages -->
  ${videos.map((video) => `
  <url>
    <loc>${siteUrl}/videos/${video.data.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`.trim();

  // Return the XML with correct sitemap content-type headers
  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
