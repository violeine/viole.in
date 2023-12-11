import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import preact from "@astrojs/preact";
import { mdIntegration } from "@viole.in/md";

export default defineConfig({
  site: 'https://viole.in',
  build: {
    assetsPrefix: 'https://v1.viole.in'
  },
  markdown: {
    shikiConfig: {
      theme: "github-light",
      wrap: true
    }
  },
  integrations: [preact({
    compat: true
  }), svelte(), mdIntegration(), mdx()],
  output: "static",
});
