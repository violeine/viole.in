<script>
	let count = 0;

	function handleClick() {
		count += 1;
	}
</script>

<div>
	<button on:click={handleClick}>
		Svetle Count clicks: {count}
	</button>
	<button> hello </button>
</div>
