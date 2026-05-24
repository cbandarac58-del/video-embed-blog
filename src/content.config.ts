import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const videos = defineCollection({
  // Use the built-in file loader to read from a single centralized database.json
  loader: file("src/content/videos/database.json"),
  schema: z.object({
    id: z.string(), // Required by the file loader for unique identification
    title: z.string(),
    slug: z.string(),
    embedUrl: z.string(),
    thumbnailUrl: z.string(), // Added support for real thumbnails
    tags: z.array(z.string()),
    category: z.string(),
    rating: z.number().min(0).max(100).optional().default(90), // Make optional with a default to simplify manual entry
    views: z.number().int().nonnegative(),
    dateAdded: z.string() // YYYY-MM-DD
  })
});

export const collections = { videos };
