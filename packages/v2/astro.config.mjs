import { defineConfig } from 'astro/config';
import { mdIntegration } from '@viole.in/md';

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false
  },
  integrations: [mdIntegration(), svelte()],
  build: {
    format: 'file'
  }
});