import { lerp } from "@/lib/mae";

export const dimensions = {
	width: 512,
	height: 512,
	animate: {
		duration: 3000,
	},
};

export function draw(ctx, { playhead }) {
	// console.log(playhead);
	const width = dimensions.width;
	const height = dimensions.height;
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = "#f3e9eb";
	ctx.fillRect(0, 0, width, height);
	const gridSize = 7;
	const padding = width * 0.2;
	const tileSize = (width - padding * 2) / gridSize;

	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			// get a 0..1 UV coordinate
			const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
			const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

			// scale to dimensions with a border padding
			const tx = lerp(padding, width - padding, u);
			const ty = lerp(padding, height - padding, v);

			// here we get a 't' value between 0..1 that
			// shifts subtly across the UV coordinates
			const offset = u * 0.2 + v * 0.1;
			const t = (playhead + offset) % 1;

			// now we get a value that varies from 0..1 and back
			let mod = Math.sin(t * Math.PI);

			// we make it 'ease' a bit more dramatically with exponential
			mod = Math.pow(mod, 3);

			// now choose a length, thickness and initial rotation
			const length = tileSize * 0.65;
			const thickness = tileSize * 0.1;
			const initialRotation = Math.PI / 2;

			// And rotate each line a bit by our modifier
			const rotation = initialRotation + mod * Math.PI;

			// Now render...
			d(ctx, tx, ty, length, thickness, rotation);
		}
	}
}


function d(ctx, x, y, l, thicc, r) {
	ctx.save();
	ctx.fillStyle = "black";

	ctx.translate(x, y);
	ctx.rotate(r);
	ctx.translate(-x, -y);

	ctx.fillRect(x - l / 2, y - thicc / 2, l, thicc);
	ctx.restore();
}
