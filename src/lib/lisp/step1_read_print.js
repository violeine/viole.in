import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { read_str } from "./reader.js";
import { pr_str } from "./printer.js";
function READ(str) {
  return read_str(str);
}

function EVAL(mal) {
  return mal;
}

function PRINT(mal) {
  console.log(pr_str(mal));
}

function rep(str) {
  try {
    return PRINT(EVAL(READ(str)));
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
