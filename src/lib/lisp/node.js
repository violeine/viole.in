import { pr_str } from "./printer.js";
import { EVAL, READ } from "./step9_try.js";
import { repl_env } from "./env.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output, argv } from "node:process";

function PRINT(mal) {
	console.log(pr_str(mal));
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

rep("(def! not (fn* (a) (if a false true)))");
rep(
	"(def! load-file (fn* (f) (eval (read-string (str \"(do \" (slurp f) \"\nnil)\")))))"
);
rep(
	"(defmacro! cond (fn* (& xs) (if (> (count xs) 0) (list 'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw \"odd number of forms to cond\")) (cons 'cond (rest (rest xs)))))))"
);


const rl = readline.createInterface({ input, output, prompt: "user> " });

rl.prompt();
rl.on("line", (input) => {
	rep(input);
	rl.prompt();
});
