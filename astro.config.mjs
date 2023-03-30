import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
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
  }), mdx(), react(), svelte(), preact()]
  // output: "server",
  // adapter: vercel()
});
