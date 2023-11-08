<script>
	let canvas, device, ctx;
	import { onMount } from "svelte";
	onMount(async () => {
		ctx = canvas.getContext("webgpu");
		const adapter = await navigator.gpu.requestAdapter();
		device = await adapter.requestDevice();
		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		ctx.configure({ device, format: presentationFormat });
		return draw(ctx, device);
	});
</script>

<canvas bind:this={canvas} />
