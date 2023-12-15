<script>
	import { animate } from "./lib/animate";
	let canvas = $state();
	let { draw, dimension } = $props();

	const dpi = window.devicePixelRatio;
	$effect(() => {
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
