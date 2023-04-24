// memory layout
// 4096 bytes size -> each index have 1 byte -> stored in big endian fashion

// 0-1FF: reserved 
// 200-E8F: start of useable memory
// E90-FFF: reserved for variable and display

// # instruction
// 2bytes(16bit) in length
// stored in big-edian fashion => `1f|2e` 


const memory = new Uint8Array(4096);


const registers = new Uint8Array(16); //16 general register able to store 0x00-0xff int

let I = 0; //adress register

let PC = 0x200; // program counter, store current address, start at 0x200

const stack = new Uint16Array(16); // only store address, which is from `0x000-0xfff`

let SP = -1;


