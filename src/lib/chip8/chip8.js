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

export const chip8 = (debug, web) => {
  const CPU = {
    memory: new Uint8Array(4096),
    V: new Uint8Array(16), //16 general register able to store 0x00-0xff int
    I: 0, //adress register
    PC: 0x200, // program counter, store current address, start at 0x200
    stack: new Uint16Array(16), // only store address, which is from `0x000-0xfff`
    SP: -1,
    instructions: new Map(),
    framebuffer: framebuffer(web),
    run: true,
    cycle:0,
    DT: 0,
    ST:0,
  }

  if (debug) debug.value={...CPU};

  const load = (rom) => {
    const offset = 0x200;
    for (let i = 0; i < rom.length - 1; i += 2) {
      const op = rom[i] << 8 | rom[i + 1];
      const ins = instructions.find(({ pattern, mask }) => {
        return pattern === (op & mask);
      });
      CPU.instructions.set(offset+i, ins ? { op, ...ins.parse(op, CPU)} : { op, desc: "???" });
      CPU.memory[offset+i] = rom[i];
      CPU.memory[offset+i+1]=rom[i+1];
      if (debug) debug.value={...CPU};
    }
  }

  const fetch = () => {
    if (CPU.PC > 0xfff) CPU.run = false;
    const ins = CPU.instructions.get(CPU.PC);
    if (!ins) CPU.run = false;
    CPU.PC+=2;
    CPU.cycle+=1;
    return ins;
  }

  const execute = (ins) => {
    if (ins?.exec !== undefined) {
      ins.exec()
    }
  }

  const step = () => {
      execute(fetch());
      if (debug) debug.value= {...CPU };
      console.log(CPU);
  }

  const run = () => {
    while (CPU.run) {
        step();
    }
  }
  const pause = ()=>{
      CPU.run = false;
      if (debug) debug.value= {...CPU };
  }
  return {
    load,
    step,
    run,
    pause
  }
}
