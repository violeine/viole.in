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
      return [
        "map",
        value.map((el) => {
          return EVAL(el, env);
        }),
      ];
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
        const [a1, a2, a3, a4] = value;
        switch (a1.at(1)) {
          case "def!": {
            return env.set(a2.at(1), EVAL(a3, env));
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
          case "fn*": {
            const sym = a2.at(1).map(valueof);
            return [
              "fn*",
              {
                ast: a3,
                params: a2.at(1).map(valueof),
                env: env,
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

function rep(str) {
  try {
    return PRINT(EVAL(READ(str), repl_env));
  } catch (err) {
    if (err !== "noop") console.log(err);
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
const rl = readline.createInterface({ input, output, prompt: "user> " });
rl.prompt();
rl.on("line", (input) => {
  rep(input);
  rl.prompt();
});
