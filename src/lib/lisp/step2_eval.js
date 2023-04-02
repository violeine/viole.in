import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { read_str } from "./reader.js";
import { Env, repl_env } from "./env.js";
import { pr_str } from "./printer.js";
import { valueof } from "./type.js";
function READ(str) {
  return read_str(str);
}

function apply(fn, ...args) {
  const values = args.map(valueof);
  return fn(...values);
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
      const [fn, ...args] = eval_ast(ast, env);
      return apply(fn, ...args);
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

const rl = readline.createInterface({ input, output, prompt: "user> " });
rl.prompt();
rl.on("line", (input) => {
  rep(input);
  rl.prompt();
});
