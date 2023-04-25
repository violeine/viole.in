// memory layout
// 4096 bytes size -> each index have 1 byte -> stored in big endian fashion

// 0-1FF: reserved 
// 200-E8F: start of useable memory
// E90-FFF: reserved for variable and display

// # instruction
// 2bytes(16bit) in length
// stored in big-edian fashion => `1f|2e` 

import { instructions } from "./instruction";

const CPU = {
  memory: new Uint8Array(4096),
  V: new Uint8Array(16), //16 general register able to store 0x00-0xff int
  I: 0, //adress register
  PC: 0x200, // program counter, store current address, start at 0x200
  stack: new Uint16Array(16), // only store address, which is from `0x000-0xfff`
  SP: -1,
}

export const load = (rom) => {
  const line = [];
  for (let i = 0; i < rom.length; i += 2) {
    const op = rom[i] << 8 | rom[i + 1];
    const ins = instructions.find(({ pattern, mask }) => {
      return pattern === (op & mask);
    })
    ins !== undefined ? line.push(`0x${(i + 0x200).toString(16).padStart(3, "0")}|${ins.parse(op).desc}`) : line.push(`0x${(i + 0x200).toString(16)}|${op.toString(16).padStart(4, "0")}|???`);
  }
  return line;
}
