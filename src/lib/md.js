import { renderMarkdown } from "@astrojs/markdown-remark"

export const md = Symbol.for("md");

export const render = async (str, isInline) => {
  const t = await renderMarkdown(str, globalThis[md]);
  return isInline ? inline(t.code) : t.code;
}

export const inline = str => {
  //has <p> tag at start and end 
  const hasP = str.indexOf('<p>') === 0 && str.indexOf('</p>') === str.length - 4;
  return hasP ? str.slice(3, -4) : str;
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

