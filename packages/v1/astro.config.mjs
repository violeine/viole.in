import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import preact from "@astrojs/preact";
import { mdIntegration } from "@viole.in/md";

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "github-light",
      wrap: true
    }
  },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), preact({
    compat: true
  }), svelte(), mdIntegration(), mdx()],
  output: "static",
});
