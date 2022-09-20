/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

// shamelessly took from https://github.dev/thien-do/memos.pub/blob/main/lib/blog/page/main.tsx :awkward:

// For the typography plugin, we prefer Element Modifiers over direct CSS
// configuration here. Should only use this for stuff that cannot be applied
// via Element Modifiers.
// - Also note that CSS config here has less specificity than Element Modifiers
// (this uses :where() while modifier uses :is())
// - https://tailwindcss.com/docs/typography-plugin#element-modifiers
// - https://tailwindcss.com/docs/typography-plugin#customizing-the-css
const typography = (_theme) => ({
  DEFAULT: {
    css: {
      // Define here so that Tailwind's "pre code" can override them
      code: { padding: "0.2em 0.4em", fontWeight: 400 },
      "h1 code": { fontWeight: "inherit" },
      "h2 code": { fontWeight: "inherit" },
      "h3 code": { fontWeight: "inherit" },
      // Matches both <pre> and <code>
      '[data-theme="dark"]': { display: "none" },
    },
  },
  invert: {
    css: {
      '[data-theme="light"]': { display: "none" },
      // Reverse the "DEFAULT" style
      'pre[data-theme="dark"]': { display: "block" },
      'code[data-theme="dark"]': { display: "inline" },
    },
  },
});
module.exports = {
  content: ["./src/**/*.{html,js,astro}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Lexend Deca", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        "prose-80": "80ch",
      },
      typography: typography,
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
