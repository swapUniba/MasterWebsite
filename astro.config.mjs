import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://swapUniba.github.io',
  base: '/MasterWebsite',
  output: 'static',
  integrations: [sitemap()],
});
