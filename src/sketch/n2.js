import { lerp } from "@/lib/mae.js";
import { noise2D } from "@/lib/ron.js";

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
const margin = 40;
const points = createGrid();

export const dimensions = {
	width: 1048,
	height: 1048,
}


export function draw(ctx) {
	ctx.fillStyle = "black";

	ctx.fillRect(0, 0, 1048, 1048);
	points.forEach(({ pos: [u, v], rad, rotate }) => {
		const x = lerp(margin, 512 - margin, u);
		const y = lerp(margin, 512 - margin, v);
		ctx.save();
		ctx.strokeStyle = "white"
		ctx.beginPath();
		ctx.arc(x, y, rad * 20, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
	});
}

