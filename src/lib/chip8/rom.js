import fs from 'node:fs/promises'
import { signal } from '@preact/signals'

const path = `${process.cwd()}/src/lib/chip8/1-chip8-logo.ch8`
const url = new URL(path, import.meta.url)

export const dump = async () => {
  let rom = [];
  const fileHandle = await fs.open(url);
  const romStream = fileHandle.createReadStream({
    highWaterMark: 16
  });
  let i = 0;
  const d = [`  offset  |00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f`];
  romStream.on("data", chunk => {
    const hex = [];
    const ascii = [];
    const address = i.toString(16).padStart(8, "0");
    rom.push(chunk);
    chunk.forEach(e => {
      hex.push(e.toString(16).padStart(2, "0"));
      ascii.push(e >= 0x20 && e < 0x7f ? String.fromCharCode(e) : ".");
    })
    i = i + 16;
    d.push(`0x${address}|${hex.join(" ").padEnd(32 + 15, " ")}|${ascii.join("")}`);
  })

  await new Promise((resolve) => {
    romStream.on("end", () => resolve());
  });
  return {
    d,
    rom: Buffer.concat(rom),
  }
}
