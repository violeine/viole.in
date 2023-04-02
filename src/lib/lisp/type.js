const availableType = [
  "list",
  "vector",
  "map",
  "string",
  "scalar",
  "symbol",
  "keyword",
  "function",
  "fn*",
  "atom",
];
const nil = null;

export function _typeof(mal) {
  return mal.at(0);
}

export function valueof([type, value]) {
  if (["list", "vector"].includes(type)) return value.map((el) => valueof(el));
  if (type === "map") {
    const t = Array.from(value)
      .map(([k, v]) => [JSON.parse(k), valueof(v)])
      .sort();
    return t;
  }
  return value;
}

export function infer(mal) {
  if ((typeof mal === "number") | (typeof mal === "boolean")) return "scalar";
  if (typeof mal === "string" && mal.at(0) !== ":") return "string";
  if (typeof mal === "string" && mal.at(0) === ":") return "keyword";
  if (Array.isArray(mal)) return "list";
}
