<script>
	import { onMount, createEventDispatcher } from "svelte";
	let canvas;
	export let dimension;
	export let draw;
	const dpi = window.devicePixelRatio;
	onMount(() => {
		const ctx = canvas.getContext("2d");
		ctx.scale(dpi, dpi);
		draw(ctx);
	});
</script>

<canvas bind:this={canvas} width={dimension.width} height={dimension.height} />
<slot />

<style>
	canvas {
		width: 512px;
		height: 512px;
	}
</style>
