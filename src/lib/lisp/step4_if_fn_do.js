import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { read_str } from "./reader.js";
import { Env, repl_env } from "./env.js";
import { pr_str } from "./printer.js";
import { valueof, infer } from "./type.js";

function READ(str) {
  return read_str(str);
}

function apply(fn, ...args) {
  // very wrong here, passthrough and deal with it inside there
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
function EVAL(ast, env) {
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
          return EVAL(a3, let_env);
        }
        case "if": {
          const pred = EVAL(a2, env).at(1);
          const isTruthful = pred === null || pred === false;
          return EVAL(!isTruthful ? a3 : a4 ? a4 : ["nil", null], env);
        }
        case "fn*": {
          const sym = a2.at(1).map(valueof);
          return ["function", (...args) => EVAL(a3, Env(env, sym, args))];
        }
        case "do": {
          const r = eval_ast(["list", value.slice(1)], env);
          return r.at(-1);
        }
        default: {
          const [fn, ...args] = eval_ast(ast, env);
          return apply(fn.at(1), ...args);
        }
      }
    }
  } else return eval_ast(ast, env);
}

function PRINT(mal) {
  console.log(pr_str(mal));
}

function rep(str) {
  try {
    return PRINT(EVAL(READ(str), repl_env));
  } catch (err) {
    console.log(err);
  }
}

rep("(def! not (fn* (a) (if a false true)))");

const rl = readline.createInterface({ input, output, prompt: "user> " });
rl.prompt();
rl.on("line", (input) => {
  rep(input);
  rl.prompt();
});
