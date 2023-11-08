<script>
	import { onMount } from "svelte";
	import { animate } from "./animate";
	let canvas;
	export let dimension;
	export let draw;
	const dpi = window.devicePixelRatio;
	onMount(() => {
		canvas.width = dpi * dimension.width;
		canvas.height = dpi * dimension.height;
		canvas.style.width = `${dimension.width}px`;
		canvas.style.height = `${dimension.height}px`;
		const ctx = canvas.getContext("2d");
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		ctx.scale(dpi, dpi);
		if (dimension.animate) {
			return animate(dimension.animate, (arg) => draw(ctx, arg));
		} else {
			draw(ctx);
		}
	});
</script>

<canvas bind:this={canvas} />
