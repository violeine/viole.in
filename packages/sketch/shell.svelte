<script>
  let { file } = $props();
  import Sketch from "./sketch.svelte";
  console.log(file);
</script>

{#await import(`./sketch/${file}.js`) then c}
  <Sketch {...c} />
{/await}
