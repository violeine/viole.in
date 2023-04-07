<script>
	import { onMount } from "svelte";
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
			const { duration } = dimension.animate;
			let frame;
			let elapsed = 0; //time start
			let lastTime = performance.now();
			(function loop() {
				frame = requestAnimationFrame(loop);
				const beginTime = performance.now();
				const dt = beginTime - lastTime;
				elapsed += dt;
				lastTime = beginTime;

				//restart the loop when elapsed exceed defined duration
				if (elapsed > duration) {
					elapsed = elapsed % duration; //wrap around duration
				}
				draw(ctx, {
					elapsed,
					playhead: elapsed / duration, //normalize duration between 0..1
				});
			})();
			return () => {
				cancelAnimationFrame(frame);
			};
		} else {
			draw(ctx);
		}
	});
</script>

<canvas bind:this={canvas} />
