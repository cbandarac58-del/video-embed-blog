import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // SSR mode: pages render on-demand by default now (needed so video pages
  // can scale to unlimited videos without build-time generation).
  // Pages that should stay static & fast (home, categories) opt back in
  // with `export const prerender = true;` at the top of their frontmatter.
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  site: 'https://vixtube.net',
});
