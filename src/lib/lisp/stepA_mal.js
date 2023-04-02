import * as readline from "node:readline/promises";

import { stdin as input, stdout as output, argv } from "node:process";
import { read_str } from "./reader.js";
import { Env, repl_env } from "./env.js";
import { pr_str } from "./printer.js";
import { valueof, infer } from "./type.js";

function READ(str) {
  return read_str(str);
}

function apply(fn, ...args) {
  // very wrong here, passthrough and deal with it inside the function
  // const values = args.map(valueof);
  const result = fn(...args);
  return result;
}

function eval_ast(ast, env) {
  const [type, value] = ast;
  switch (type) {
    case "symbol":
      return env.get(value);
    case "list":
      return value.map((el) => {
        return EVAL(el, env);
      });
    case "vector":
      return [
        "vector",
        value.map((el) => {
          return EVAL(el, env);
        }),
      ];
    case "map":
      const t = new Map();
      for (const [k, v] of value) {
        t.set(k, EVAL(v, env));
      }
      return ["map", t];
    default:
      return ast;
  }
}
export function EVAL(ast, env) {
  while (true) {
    const [type, value] = ast;
    if (type === "list") {
      if (value.length === 0) return ast;
      else {
        ast = macroexpand(ast, env);
        const [type, value] = ast;
        if (type !== "list") return eval_ast(ast, env);
        const [a1, a2, a3, a4] = value;
        switch (a1.at(1)) {
          case "def!": {
            return env.set(a2.at(1), EVAL(a3, env));
          }
          case "defmacro!": {
            const [t, v] = EVAL(a3, env);
            if (t !== "fn*") throw "not a function";
            return env.set(a2.at(1), ["fn*", { ...v, is_macro: true }]);
          }
          case "macroexpand": {
            return macroexpand(a2, env);
          }
          case "try*": {
            try {
              return EVAL(a2, env);
            } catch (err) {
              const [_, exec] = a3 ?? [];
              if (exec && exec.at(0).at(1) === "catch*") {
                return EVAL(
                  exec.at(2),
                  new Env(
                    env,
                    [exec.at(1).at(1)],
                    typeof err === "string" ? [["string", err]] : [err]
                  )
                );
              } else throw err;
            }
          }
          case "let*": {
            const let_env = Env(env);
            const bindings = a2.at(1).map(valueof);
            for (let i = 0; i <= bindings.length / 2; i += 2) {
              let_env.set(bindings[i], EVAL(a2.at(1)[i + 1], let_env));
            }
            env = let_env;
            ast = a3;
            break;
          }
          case "if": {
            const pred = EVAL(a2, env).at(1);
            const isTruthful = pred === null || pred === false;
            if (!isTruthful) {
              ast = a3;
            } else {
              if (a4) {
                ast = a4;
              } else {
                ast = ["nil", null];
              }
            }
            break;
          }
          case "do": {
            eval_ast(["list", value.slice(1, -1)], env);
            ast = value.at(-1);
            break;
          }
          case "quote": {
            return a2;
          }
          case "quasiquoteexpand": {
            return quasiquote(a2);
          }
          case "quasiquote": {
            ast = quasiquote(a2);
            break;
          }
          case "fn*": {
            const sym = a2.at(1).map(valueof);
            return [
              "fn*",
              {
                ast: a3,
                params: a2.at(1).map(valueof),
                env: env,
                is_macro: false,
                fn: (...args) => EVAL(a3, Env(env, sym, args)),
              },
            ];
          }
          default: {
            const [fn, ...args] = eval_ast(ast, env);
            if (fn.at(0) === "function") return apply(fn.at(1), ...args);
            else {
              const f = fn.at(1);
              ast = f.ast;
              env = Env(f.env, f.params, args);
              break;
            }
          }
        }
      }
    } else return eval_ast(ast, env);
  }
}

function PRINT(mal) {
  console.log(pr_str(mal));
}
function qquote(value) {
  let result = ["list", []];
  const reverse = [...value].reverse();
  reverse.forEach(([t, v]) => {
    if (t === "list") {
      const [t1, v1] = v.at(0) ?? [];
      if (t1 === "symbol" && v1 === "splice-unquote") {
        result = ["list", [["symbol", "concat"], v.at(1), result]];
      } else {
        result = ["list", [["symbol", "cons"], quasiquote([t, v]), result]];
      }
    } else {
      result = ["list", [["symbol", "cons"], quasiquote([t, v]), result]];
    }
  });
  return result;
}
function quasiquote(ast) {
  const [type, value] = ast;
  if (type === "list") {
    const [t, v] = value.at(0) ?? [];
    if (t === "symbol" && v == "unquote") {
      return value.at(1);
    } else {
      return qquote(value);
    }
  }
  if (type === "vector") return ["list", [["symbol", "vec"], qquote(value)]];

  if (type === "map" || type === "symbol")
    return ["list", [["symbol", "quote"], ast]];
  return ast;
}

function is_macro_call([type, value], env) {
  if (type === "list") {
    const [t, v] = value.at(0);
    if (t === "symbol" && env.find(v)) {
      const [t1, v1] = env.get(v);
      if (t1 === "fn*" && v1.is_macro) return true;
    }
  }
  return false;
}
function macroexpand(ast, env) {
  while (is_macro_call(ast, env)) {
    const [_, value] = ast;
    const [macro, ..._args] = value;
    const fn = env.get(macro.at(1));
    ast = fn.at(1).fn(..._args);
  }
  return ast;
}
function rep(str) {
  try {
    return PRINT(EVAL(READ(str), repl_env));
  } catch (err) {
    if (Array.isArray(err) && err.length === 2)
      console.log(`Error: ${pr_str(err)}`);
    else if (err !== "noop") console.log(err);
  }
}

repl_env.set("eval", [
  "function",
  (ast) => {
    return EVAL(ast, repl_env);
  },
]);

repl_env.set("*ARGV*", ["list", argv.slice(2).map((e) => ["string", e])]);

rep("(def! not (fn* (a) (if a false true)))");
rep(
  `(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))`
);
rep(
  `(defmacro! cond (fn* (& xs) (if (> (count xs) 0) (list 'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw \"odd number of forms to cond\")) (cons 'cond (rest (rest xs)))))))`
);
const rl = readline.createInterface({ input, output, prompt: "user> " });
rl.prompt();
rl.on("line", (input) => {
  rep(input);
  rl.prompt();
});
