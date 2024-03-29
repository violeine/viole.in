import { pick } from "../lib/ron";

export const dimension = {
	width: 512,
	height: 512,
};

const rectArray = (num, length) => {
	const points = [];
	for (let x = 0; x < num * length; x += length) {
		for (let y = 0; y < num * length; y += length) {
			points.push(drawArc([x, y, length, length]));
		}
	}
	return points;
};

const rect = rectArray(10, 50);
const r = [Math.PI * 0.5, Math.PI, Math.PI * 1.5, Math.PI * 2,];

function drawArc([x, y, l1, l2]) {
	return (ctx) => {
		ctx.save();
		ctx.translate(x + l1 / 2, y + l1 / 2);
		ctx.rotate(pick(r));
		ctx.lineWidth = 3;
		ctx.beginPath();
		// ctx.moveTo(-l1 / 2, -l1 / 2);
		ctx.arc(-l1 / 2, -l1 / 2, 25, 0, Math.PI / 2);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(-l1 / 2 + l1, -l1 / 2 + l1, 25, Math.PI, - Math.PI / 2);
		ctx.stroke();
		// ctx.lineTo(-l1 / 2, -l1 / 2);
		ctx.restore();
	};
}

// count per row: round (width - margin)/length

// figuring out how to use lerp properly
export function draw(ctx) {
	ctx.fillStyle = "#f3e9eb";
	ctx.translate(0.5, 0.5);
	ctx.fillRect(0, 0, dimension.width, dimension.height);
	rect.forEach((d) => d(ctx));
}
