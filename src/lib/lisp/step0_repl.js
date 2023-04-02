import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

function READ(str) {
  return str;
}

function EVAL(str) {
  return str;
}

function PRINT(str) {
  console.log(str);
}

function rep(str) {
  return PRINT(EVAL(READ(str)));
}

const rl = readline.createInterface({ input, output, prompt: "user> " });
rl.prompt();
rl.on("line", (input) => {
  rep(input);
  rl.prompt();
});
