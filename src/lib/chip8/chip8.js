// memory layout
// 4096 bytes size -> each index have 1 byte -> stored in big endian fashion

// 0-1FF: reserved 
// 200-E8F: start of useable memory
// E90-FFF: reserved for variable and display

// # instruction
// 2bytes(16bit) in length
// stored in big-edian fashion => `1f|2e` 

import { instructions } from "./instruction";
import { framebuffer, termRender } from "./framebuffer.js";
import { keys } from "./keys.js";

export const chip8 = (debug, web) => {

	const CPU = {
		memory: new Uint8Array(4096),
		V: new Uint8Array(16), //16 general register able to store 0x00-0xff int
		I: 0, //adress register
		PC: 0x200, // program counter, store current address, start at 0x200
		stack: new Uint16Array(16), // only store address, which is from `0x000-0xfff`
		SP: 0,
		framebuffer: framebuffer(web),
		run: false,
		cycle:0,
		DT: 0,
		ST: 0,
		frametime: 1000/60, // hz
		stepPerCycle: 20,
		keypad: keys(),
	};

	if (debug) debug.value={...CPU};

	const load = (rom) => {
		const offset = 0x200;
		for (let i = 0; i < rom.length; i+=2) {
			CPU.memory[offset+i] = rom[i];
			CPU.memory[offset+i+1]=rom[i+1];
		}
		if (debug) debug.value={...CPU};
	};

	const fetch = () => {
		if (CPU.PC > 0xfff) CPU.run = false;
		const op = (CPU.memory[CPU.PC]<<8) | CPU.memory[CPU.PC+1];
		const ins = instructions.find(({ pattern, mask }) => {
			return pattern === (op & mask);
		});
		CPU.PC+=2;
		return ins.parse(op, CPU);
	};

	const execute = (ins) => {
		if (ins?.exec !== undefined) {
			ins.exec();
		}
	};

	const step = () => {
		execute(fetch());
		if (debug) debug.value= {...CPU };
	};

	const pause = ()=>{
		CPU.run = false;
		if (debug) debug.value= {...CPU };
	};

	const cycle = () => {
		//one cpu cycle consist of 20 steps;
		for (let i=0; i < CPU.stepPerCycle; i++) {
			step();
		}
		if (CPU.ST > 0) CPU.ST-=1;
		if (CPU.DT > 0) CPU.DT-=1;
	};

	// tick run 
	const tick = () => {
		const id = window.setTimeout(()=>{
			cycle();
			window.requestAnimationFrame(tick);
		}, CPU.frametime); 
		if (CPU.run === false) {
			window.clearTimeout(id);
		}
		return id;
	};

	const run = () => {
		CPU.run = true;
		const id = tick();
	};

	return {
		load,
		step,
		run,
		pause,
		keys: CPU.keypad,
	};
};
