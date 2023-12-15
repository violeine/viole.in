import { lerp } from "../lib/mae.js";
import { noise2D } from "../lib/ron.js";

export const dimension = {
	width: 512,
	height: 512,
};

function createGrid() {
	const points = [];
	const count = 25;
	for (let x = 0; x < count; x++) {
		for (let y = 0; y < count; y++) {
			const u = count <= 1 ? 0.5 : x / (count - 1); //count explode when div with 0 lol
			const v = count <= 1 ? 0.5 : y / (count - 1);
			const radius = noise2D(u, v) * 0.25;
			points.push({
				rotate: noise2D(u, v) * 0.5,
				color: "#ffffff",
				pos: [u, v],
				rad: Math.abs(radius),
			});
		}
	}

	return points;
}

const points = createGrid();

const margin = 40;
export function draw(ctx) {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, 512, 512);

	points.forEach(({ pos: [u, v], rad, rotate }) => {
		const x = lerp(margin, 512 - margin, u);
		const y = lerp(margin, 512 - margin, v);
		ctx.save();
		ctx.fillStyle = "black";
		ctx.font = `${rad * 400}px "Arial"`;
		ctx.translate(x, y);
		ctx.rotate(rotate);
		ctx.fillText(".", 0, 0);
		ctx.restore();
	});
}

