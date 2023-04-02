import { valueof } from "./type.js";
import { ns } from "./core.js";

export function Env(outer = null, binds = [], exprs = []) {
  const data = new Map();
  for (var i = 0; i < binds.length; i++) {
    if (binds[i] === "&") {
      data.set(binds[i + 1], ["list", exprs.slice(i)]);
      break;
    } else {
      data.set(binds[i], exprs[i]);
    }
  }
  return {
    set(symbol, mal) {
      data.set(symbol, mal);
      return mal;
    },
    find(symbol) {
      if (data.has(symbol)) return data;
      else if (outer !== null) return outer.find(symbol);
      else return null;
    },
    get(symbol) {
      const env = this.find(symbol);
      if (env !== null) {
        return env.get(symbol);
      } else throw `'${symbol}' not found`;
    },
  };
}

export const repl_env = Env();

Object.entries(ns).map(([k, v]) => repl_env.set(k, v));
