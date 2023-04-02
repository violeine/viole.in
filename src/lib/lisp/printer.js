export function pr_str([type, value], print_readably = true) {
  if (type === "list")
    return `(${value.map((el) => pr_str(el, print_readably)).join(" ")})`;
  if (type === "map") {
    return `{${Array.from(value)
      .map(([k, v]) => {
        return [
          pr_str(JSON.parse(k), print_readably),
          pr_str(v, print_readably),
        ];
      })
      .flat()
      .join(" ")}}`;
  }
  if (type === "vector")
    return `[${value.map((el) => pr_str(el, print_readably)).join(" ")}]`;
  if (type === "string") {
    return print_readably
      ? `"${value
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")}"`
      : value;
  }
  if (type === "keyword") return `${value}`;
  if (type === "function") return `#<function>`;
  if (type === "fn*") {
    if (value.is_macro) return "#<macro*>";
    return "#<fn*>";
  }
  if (type === "atom") return `(atom ${pr_str(value.deref())})`;
  if (type === "nil") return "nil";
  return value;
}
