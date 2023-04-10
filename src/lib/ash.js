import { readdir } from "node:fs/promises";

const pagesDir = `${process.cwd()}/src/pages/`

export function toURL(url) {
  return url.split(".").slice(0, -1).join(".").trim() || url;
}

export const groupBy = (x, f) =>
  // https://stackoverflow.com/a/64489535
  x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

export async function listContent(dir) {
  const url = new URL(
    pagesDir,
    import.meta.url
  );
  const currentPath = dir?.split("/") ?? [];
  const files = await list(url, currentPath);
  return Object.values(
    groupBy(files.flat(Infinity), (k) => k.split("/").length)
  );
}

async function list(dir, currentPath) {
  if (dir.href.at(-1) !== "/") dir.pathname += "/";
  const entries = await readdir(dir, { withFileTypes: true });
  const t = await Promise.all(
    entries.map(async (e) => {
      if (e.isDirectory() && currentPath.includes(e.name)) {
        return [
          new URL(e.name, dir).pathname.split("/src/pages/").at(-1),
          await list(new URL(e.name, dir), currentPath),
        ];
      } else if (!e.name.startsWith("index") && !e.name.startsWith("404") && !e.name.startsWith("[...slug]")) {
        return new URL(e.name, dir).pathname.split("/src/pages/").at(-1);
      }
    })
  );
  return t.filter(Boolean);
}
