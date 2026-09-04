import { getCollection } from 'astro:content';

export const GET = async () => {
  try {
    const videos = await getCollection('videos');

    const searchIndex = videos.map(v => ({
      title: v.data.title,
      slug: v.slug || v.data.slug,
      rating: v.data.rating || 90,
      views: v.data.views || '100K',
      category: v.data.category || 'Other',
      tags: v.data.tags || [],
      thumbnailUrl: v.data.thumbnailUrl || '',
      dateAdded: v.data.dateAdded
    }));

    searchIndex.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
};
