// import fs from 'node:fs/promises'


// export const dump = async () => {
// const path = `${process.cwd()}/src/lib/chip8/2-ibm-logo.ch8`;
// const url = new URL(path, import.meta.url)
//   let rom = [];
//   const fileHandle = await fs.open(url);
//   const romStream = fileHandle.createReadStream({
//     highWaterMark: 16
//   });
//   let i = 0;
//   const d = [`  offset  |00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f`];
//   romStream.on("data", chunk => {
//     const hex = [];
//     const ascii = [];
//     const address = i.toString(16).padStart(8, "0");
//     rom.push(chunk);
//     chunk.forEach(e => {
//       hex.push(e.toString(16).padStart(2, "0"));
//       ascii.push(e >= 0x20 && e < 0x7f ? String.fromCharCode(e) : ".");
//     })
//     i = i + 16;
//     d.push(`0x${address}|${hex.join(" ").padEnd(32 + 15, " ")}|${ascii.join("")}`);
//   })
//
//   await new Promise((resolve) => {
//     romStream.on("end", () => resolve());
//   });
//   return signal({
//     d,
//     rom: Buffer.concat(rom),
//   })
// }
export const roms=["1-chip8-logo.ch8", "2-ibm-logo.ch8", "3-corax+.ch8", "4-flags.ch8", "5-quirks.ch8", "6-keypad.ch8", "Trip8 Demo (2008).ch8"];
export async function fetchRom(r) {
	const t = await fetch(`/${r}`).then(r=>r.arrayBuffer());
	return t;
}
