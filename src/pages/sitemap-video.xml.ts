import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request }) => {
  const siteUrl = 'https://vixtube.net';
  const allVideos = await getCollection('videos');

  // Helper function to escape XML special characters
  const escapeXml = (unsafe: string) => {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const videoSitemapItems = allVideos
    .map((video) => {
      const data = video.data;
      const videoPageUrl = `${siteUrl}/videos/${video.slug}`;
      const title = escapeXml(data.title || 'Adult Video');
      const description = escapeXml(data.description || `${title} - Watch free streaming on VixTube.`);
      const thumbnailUrl = escapeXml(data.thumbnailUrl || `${siteUrl}/default-thumb.jpg`);
      const embedUrl = escapeXml(data.embedUrl || '');
      const pubDate = data.dateAdded ? new Date(data.dateAdded).toISOString() : new Date().toISOString();
      
      // Convert duration string/number to seconds if available (default 300s if empty)
      const duration = data.duration ? parseInt(data.duration, 10) : 300;

      return `
  <url>
    <loc>${videoPageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>${description}</video:description>
      ${embedUrl ? `<video:player_loc>${embedUrl}</video:player_loc>` : ''}
      <video:duration>${isNaN(duration) ? 300 : duration}</video:duration>
      <video:publication_date>${pubDate}</video:publication_date>
      <video:family_friendly>no</video:family_friendly>
    </video:video>
  </url>`;
    })
    .join('');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoSitemapItems}
</urlset>`;

  return new Response(xmlContent.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=14400',
    },
  });
};
