import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Fully-Dynamic SSR Mode for Cloudflare Pages
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    entrypointResolution: 'auto',
  }),
  site: 'https://vixtube.net',
  trailingSlash: 'always',
});
