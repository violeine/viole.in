import {signal} from "@preact/signals";
import { useEffect } from "preact/hooks";
import {chip8} from "./chip8.js";
import { fetchRom } from "./rom.js";
import {web} from "./web";

const debug = signal();
const c8 = chip8(debug, web);
export const formatHex = (s, pad=1) => `0x${s.toString(16).padStart(pad, "0")}`;

export const Step = ()=> <button class="monospace block" onClick={()=>{
	c8.step();
}}>Step</button>;

export const Run = ()=> <button class="monospace block" onClick={()=>{
	c8.run();
}}>Run</button>;

export const Pause = ()=> <button class="monospace block" onClick={()=>{
	c8.pause();
}}>Pause</button>;

export const State = ()=> {
	return <div class="grid monospace" style="--columns:8; --gap:8px">
		<div class="cell" data-span="1-4" style="--grid-col-start: 1; --grid-col-end:4">
        Cycle: 
		</div>
		<div class="cell" data-span="5-8" style="--grid-col-start: 5; --grid-col-end:8">
			{debug.value.cycle}
		</div>
		<div class="cell" data-span="2" style="--grid-col-end:2">
        PC: <br/> 
			{formatHex(debug.value.PC, 3)}
		</div>
		<div class="cell" data-span="2" style="--grid-col-end:2">
      I: <br/>
			{formatHex(debug.value.I, 3)}
		</div>
		<div class="cell" data-span="2" style="--grid-col-end:2">
        DT: <br/>
			{debug.value.DT}
		</div>
		<div class="cell" data-span="2" style="--grid-col-end:2">
        ST: <br/>
			{debug.value.DT}
		</div>
		<div class="cell" data-span="row">
			{debug.value.run ? "Running": "Stopped"}
		</div>
		<div class="cell" data-span="row">
        Registers:
		</div>
		{Array.from(debug.value.V.values()).map((e,i)=> (<div class="cell" key={i}>
      V{i.toString(16)} <br/>
			<span style={{fontSize:"12px"}}>{formatHex(e, 2)}</span>
		</div> ))}
		<div class="cell" data-span="4" style="--grid-col-end:4" >
        Stack:
		</div>
		<div class="cell" data-span="2" style="--grid-col-end:2" >
        SP:
		</div>
		<div class="cell" data-span="2" style="--grid-col-end:2" >
			{debug.value.SP}
		</div>
		{Array.from(debug.value.stack.values()).map((e,i)=> (<div class="cell" data-span="4" style="--grid-col-end:4" key={i}>
      Depth {i.toString().padStart(2, "0")}: <span>{formatHex(e, 3)}</span>
		</div> ))}
	</div>;
}; 

export const Instruction =()=> {
	return <code>
		{Array.from(debug.value.instructions.values()).map((e,i)=> {
			if (debug.value.PC === (0x200+(i*2))) {
				return <span 
					key={i}
					style={{
						whiteSpace:"pre",
						background: "var(--bg)",
						color: "var(--app)"
					}}>{formatHex(0x200+(i*2), 3)}|{e.desc}{"\n"}</span>;
			} 
			return <span 
				key={i}
				style={{
					whiteSpace:"pre",
					background: "var(--app)"}}>{formatHex(0x200+(i*2), 3)}|{e.desc}{"\n"}</span>;
		})}
	</code>;
};
const fetch = async ()=>{
	const t = await fetchRom();
	c8.load(new Uint8Array(t));
};

export const Loader = ()=> (<button onClick={fetch} class="monospace">
    Load 
</button>);

export const Pad = () => {
	const keyDownListener = (event)=>{
		c8.keys.setKey(event.key);
	};
	const keyUpListener = () =>{
		c8.keys.resetKey();
	};
	useEffect(()=>{
		window.addEventListener("keydown", keyDownListener);
		window.addEventListener("keyup", keyUpListener);
	}, []);
	return <div></div>;
};
