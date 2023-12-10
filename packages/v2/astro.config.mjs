import { defineConfig } from 'astro/config';
import { mdIntegration } from '@viole.in/md'

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false
  }, integrations: [mdIntegration()]
});