<script>
	import Sketch from "@/lib/sketch.svelte";
	const sketchs = import.meta.glob("../sketch/*.js", { eager: true });
</script>

{#each Object.values(sketchs) as sketch (sketch)}
	<Sketch dimension={sketch.dimensions} draw={sketch.draw} />
{/each}
