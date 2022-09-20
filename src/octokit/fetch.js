export const fetchContent = async (link) => {
  const parsedLink = parse(link);
  const [start, end] = parsedLink.hash;
  const content = await fetch(parsedLink.url).then((r) => r.text());
  return content
    .split("\n")
    .splice(start - 1, end + 1)
    .join("\n");
};

export const parse = (link) => {
  const t = new URL(link);
  const [, owner, repo, _, tree, ...route] = t.pathname.toString().split("/");
  const lang = route.at(-1).split(".").at(-1);
  const line = t.hash
    .split(`-`)
    .map((s) => s.split("L"))
    .flat()
    .filter((e) => Number(e));
  return {
    url: `https://raw.githubusercontent.com/${owner}/${repo}/${tree}/${route.join(
      "/"
    )}`,
    hash: line,
    lang: lang,
  };
};
