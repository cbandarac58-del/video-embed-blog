import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const videos = defineCollection({
  // Use glob loader to read local JSON files inside src/content/videos/
  loader: glob({ pattern: "**/*.json", base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    embedUrl: z.string(), // can be an iframe src URL
    tags: z.array(z.string()),
    category: z.string(),
    rating: z.number().min(0).max(100),
    views: z.number().int().nonnegative(),
    dateAdded: z.string() // ISO format or YYYY-MM-DD
  })
});

export const collections = { videos };
