import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  site: 'https://vixtube.net',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
