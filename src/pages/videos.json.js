import { getCollection } from 'astro:content';

export async function GET() {
  const videos = await getCollection('videos');

  // Expose clean, minimal fields needed for search and card rendering
  const searchIndex = videos.map(v => ({
    title: v.data.title,
    slug: v.data.slug,
    rating: v.data.rating || 90,
    views: v.data.views || '100K',
    category: v.data.category || 'Other',
    tags: v.data.tags || [],
    thumbnailUrl: v.data.thumbnailUrl || '',
    dateAdded: v.data.dateAdded
  }));

  // Sort by dateAdded descending by default
  searchIndex.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
