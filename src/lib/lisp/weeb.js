import { signal, effect } from '@preact/signals';

import { pr_str } from "./printer.js";

import { EVAL, READ } from './step9_try.js';
import { repl_env } from './env.js';

export const lisp_env = signal({
  print: [],
})
function PRINT(mal) {
  lisp_env.value = {
    print: [...lisp_env.value.print, String(pr_str(mal))]
  };
}

function LOG(str) {
  lisp_env.value = {
    print: [...lisp_env.value.print, str]
  };
}

export function rep(str) {
  try {
    return PRINT(EVAL(READ(str), repl_env))
  } catch (err) {
    if (Array.isArray(err) && err.length === 2)
      LOG(`Error: ${pr_str(err)}`);
    else if (err !== "noop") LOG(err);
  }
}

export function rep_multistring(str) {
  try {
    return PRINT(EVAL(READ(`(do ${str})`), repl_env))
  } catch (err) {
    if (Array.isArray(err) && err.length === 2)
      LOG(`Error: ${pr_str(err)}`);
    else if (err !== "noop") LOG(err);
  }
}

EVAL(READ("(def! not (fn* (a) (if a false true)))"), repl_env);

EVAL(READ(
  `(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))`
), repl_env);

EVAL(READ(
  `(defmacro! cond (fn* (& xs) (if (> (count xs) 0) (list 'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw \"odd number of forms to cond\")) (cons 'cond (rest (rest xs)))))))`
), repl_env);


