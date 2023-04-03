<script>
	import { onMount } from "svelte";
	import { lerp } from "@/lib/mae.js";
	import { noise2D } from "@/lib/ron.js";
	let canvas;
	const dpi = window.devicePixelRatio;
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
	console.log(points);

	onMount(() => {
		const ctx = canvas.getContext("2d");
		// canvas.width = dpi * 512;
		// canvas.height = dpi * 512;
		const { width, height } = canvas;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);
		ctx.scale(dpi, dpi);

		const margin = 40;
		points.forEach(({ pos: [u, v], rad, rotate }) => {
			const x = lerp(margin, 512 - margin, u);
			const y = lerp(margin, 512 - margin, v);
			ctx.save();
			ctx.fillStyle = "black";
			ctx.font = `${rad * 400}px "Arial"`;
			ctx.translate(x, y);
			ctx.rotate(rotate);
			ctx.fillText("-", 0, 0);
			ctx.restore();
		});
	});
</script>

<canvas bind:this={canvas} width={1024} height={1024} />

<style>
	canvas {
		width: 512px;
		height: 512px;
	}
</style>
