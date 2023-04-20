import { renderMarkdown } from "@astrojs/markdown-remark"

export const md = Symbol.for("md");

export const render = async (str) => {
  const t = await renderMarkdown(str, globalThis[md]);
  return t.code;
}
export const mdIntegration = () => {
  return {
    name: "v:md",
    hooks: {
      "astro:config:done": ({ config }) => {
        globalThis[md] = config.markdown;
      },
    },
  }
}

