import { valueof } from "./type.js";
import { pr_str } from "./printer.js";
import { read_str, createHashmap } from "./reader.js";

export const ns = {
  "+": [
    "function",
    (...args) => [
      "scalar",
      args.map(valueof).reduce((acc, value) => acc + value),
    ],
  ],
  "-": [
    "function",
    (...args) => [
      "scalar",
      args.map(valueof).reduce((acc, value) => acc - value),
    ],
  ],
  "*": [
    "function",
    (...args) => [
      "scalar",
      args.map(valueof).reduce((acc, value) => acc * value),
    ],
  ],
  "/": [
    "function",
    (...args) => [
      "scalar",
      args.map(valueof).reduce((acc, value) => acc / value),
    ],
  ],
  "pr-str": [
    "function",
    (...args) => {
      const r = args.map((e) => pr_str(e, true)).join(" ");
      return ["string", r];
    },
  ],
  str: [
    "function",
    (...args) => {
      const r = args.map((e) => pr_str(e, false)).join("");
      return ["string", r];
    },
  ],
  prn: [
    "function",
    (...args) => {
      console.log(args.map((e) => pr_str(e, true)).join(" "));
      return ["nil", null];
    },
  ],
  println: [
    "function",
    (...args) => {
      console.log(args.map((e) => pr_str(e, false)).join(" "));
      return ["nil", null];
    },
  ],
  list: [
    "function",
    (...args) => {
      return ["list", args];
    },
  ],
  "list?": ["function", ([type]) => ["scalar", type === "list"]],
  "empty?": [
    "function",
    ([type, value]) => {
      try {
        return ["scalar", value.map(valueof).length === 0];
      } catch {
        throw "cannot create a list";
      }
    },
  ],
  count: [
    "function",
    ([type, value]) => {
      try {
        if (type === "nil") return ["scalar", 0];
        return ["scalar", value.map(valueof).length];
      } catch {
        throw "cannot create a list";
      }
    },
  ],
  "=": [
    "function",
    ([t1, v1], [t2, v2]) => {
      if (["list", "vector"].includes(t1) && ["list", "vector"].includes(t2)) {
        //hacky stringify for quick compare value equality
        const sv1 = JSON.stringify(v1.map(valueof));
        const sv2 = JSON.stringify(v2.map(valueof));
        return ["scalar", sv1 === sv2];
      } else if (t1 === t2) {
        if (t1 === "map") {
          const sv1 =
            t1 === "map"
              ? JSON.stringify(valueof([t1, v1]))
              : JSON.stringify(v1.map(valueof));
          const sv2 =
            t2 === "map"
              ? JSON.stringify(valueof([t2, v2]))
              : JSON.stringify(v2.map(valueof));
          return ["scalar", sv1 === sv2];
        }
        return ["scalar", v1 === v2];
      } else return ["scalar", false];
    },
  ],
  ">": ["function", ([t1, v1], [t2, v2]) => ["scalar", v1 > v2]],
  ">=": ["function", ([t1, v1], [t2, v2]) => ["scalar", v1 >= v2]],
  "<": ["function", ([t1, v1], [t2, v2]) => ["scalar", v1 < v2]],
  "<=": ["function", ([t1, v1], [t2, v2]) => ["scalar", v1 <= v2]],
  "read-string": ["function", ([type, str]) => read_str(str)],
  slurp: [
    "function",
    ([type, arg]) => {
      const buffer = readFileSync(arg);
      return ["string", buffer.toString()];
    },
  ],
  atom: ["function", (t) => ["atom", atom(t)]],
  "atom?": ["function", ([type]) => ["scalar", type === "atom"]],
  deref: ["function", ([type, atom]) => atom.deref()],
  "reset!": ["function", ([type, atom], t) => atom.reset(t)],
  "swap!": [
    "function",
    ([type, atom], [fn_type, fn], ...args) => {
      if (fn_type === "function") return atom.swap(fn, ...args);
      return atom.swap(fn.fn, ...args);
    },
  ],
  cons: ["function", (val, [_, list]) => ["list", [val, ...list]]],
  concat: [
    "function",
    (...args) => {
      const t = args.map((el) => el.at(1)).flat(1);
      return ["list", t];
    },
  ],
  vec: ["function", ([_, value]) => ["vector", value]],
  nth: [
    "function",
    ([_, v1], [__, v2]) => {
      if (v2 < v1.length) return v1[v2];
      throw "nth: index out of range";
    },
  ],
  first: [
    "function",
    ([t, v]) => {
      if (t === "nil" || v.length === 0) return ["nil", null];
      return v.at(0);
    },
  ],
  rest: [
    "function",
    ([t, v]) => {
      if (t === "nil" || v.length === 0) return ["list", []];
      return ["list", v.splice(1)];
    },
  ],
  throw: [
    "function",
    (err) => {
      throw err;
    },
  ],
  map: [
    "function",
    ([t, v], [_, arr]) => {
      return ["list", t === "function" ? arr.map(v) : arr.map(v.fn)];
    },
  ],
  apply: [
    "function",
    ([t, v], ...args) => {
      const last = args.at(-1);
      const first = args.slice(0, args.length - 1);

      return t === "function"
        ? v(...first, ...last.at(1))
        : v.fn(...first, ...last.at(1));
    },
  ],
  "nil?": ["function", ([t, _]) => ["scalar", t === "nil"]],
  "true?": ["function", ([t, v]) => ["scalar", v === true]],
  "false?": ["function", ([t, v]) => ["scalar", v === false]],
  "symbol?": ["function", ([t, v]) => ["scalar", t === "symbol"]],
  "keyword?": ["function", ([t, v]) => ["scalar", t === "keyword"]],
  "vector?": ["function", ([t, v]) => ["scalar", t === "vector"]],
  "map?": ["function", ([t, v]) => ["scalar", t === "map"]],
  "sequential?": [
    "function",
    ([t, v]) => ["scalar", t === "vector" || t === "list"],
  ],
  "contains?": [
    "function",
    ([_, v], k) => ["scalar", v.has(JSON.stringify(k))],
  ],
  symbol: ["function", ([_, v]) => ["symbol", v]],
  keyword: [
    "function",
    ([t, v]) => (t === "keyword" ? [t, v] : ["keyword", `:${v}`]),
  ],
  vector: ["function", (...args) => ["vector", args]],
  "hash-map": ["function", (...args) => ["map", createHashmap(args)]],
  assoc: [
    "function",
    ([k, map], ...args) => ["map", new Map([...map, ...createHashmap(args)])],
  ],
  dissoc: [
    "function",
    ([k, map], ...args) => {
      const t = new Map(map);
      args.forEach((el) => t.delete(JSON.stringify(el)));
      return ["map", t];
    },
  ],
  get: [
    "function",
    ([t, map], k) =>
      t === "map" && map.has(JSON.stringify(k))
        ? map.get(JSON.stringify(k))
        : ["nil", null],
  ],
  keys: [
    "function",
    ([_, map], k) => ["list", Array.from(map.keys()).map(JSON.parse)],
  ],
  vals: ["function", ([_, map], k) => ["list", Array.from(map.values())]],
};

const atom = (val) => {
  return {
    deref: () => val,
    reset: (n) => (val = n),
    swap: (fn, ...args) => (val = fn(val, ...args)),
  };
};
