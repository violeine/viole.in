const WIDTH=64;
const HEIGHT=32;

export const framebuffer = (render) => {
	const display = new Array(WIDTH*HEIGHT).fill(0); // 64x32 pixel display;
	return {
		toggle : (x, y, n) => {
			const loc = y*WIDTH+x;
			display[loc] = display[loc] ^ n;
			return display[loc];
		}, 
		draw: () => {
			render(display);
		},
		clear: () => {
			display.fill(0);
		}
	};
};

export const termRender = (display) => {
	let line = "";
	for (let y=0;y<HEIGHT; y++) {
		for (let x=0; x<WIDTH; x++) {
			const loc = y*WIDTH+x;
			if (display[loc] === 0) line+=" "; else line+="█";
		}
		line+="\n";
	}
	console.log(line);
};
