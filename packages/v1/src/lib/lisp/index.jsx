import { signal } from '@preact/signals-core'
import { lisp_env, rep_multistring } from "./weeb.js";

const editor = signal(`;lisp
(def! fib (fn* [n]
  (if (= n 0)
    1
    (if (= n 1)
      1
      (+ (fib (- n 1))
         (fib (- n 2)))))))

(fib 12)
	`);


export function Editor() {
	return (
		<>
			<textarea
				name="editor"
				spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" class="editor monospace flex-grow" onInput={e => {
					editor.value = e.target.value
				}}>{editor.value}</textarea>
			<div>
				<button class="monospace" onClick={() => {
					rep_multistring(editor.value)
				}}>eval</button>
			</div>
		</>
	);
}
export function REPL() {
	return (<div class="repl">{
		lisp_env.value.print.map(el => <pre>{el}</pre>)
	}
		<div class="anchor" />
	</div>);
}

