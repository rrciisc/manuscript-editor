<script>
	import { onMount } from 'svelte';
	let drawing;
	let rectangle;
	let selected = false;

	onMount(async () => {
		const width = 25;
		const height = 30;
		const draw = SVG(drawing).size(1280, 617);

		rectangle = draw.polyline([[0,0], [width,0], [width,height], [0,height], [0,0]]).fill('none').stroke({ color: '#fff', width: 2 });
		rectangle.move(135, 115);
	});

	function handleClick(event) {
		const newState = selected ? { color: '#fff', width: 2 } : { color: '#f06', width: 4 };
		selected = !selected;
		rectangle.stroke(newState);
	};
</script>

<style>
	.editor-image {
		background-image: url('/image.jpeg');
		width: 1280px;
		height: 617px;
	}
</style>

<!-- <img alt='manuscript page' src='image.jpeg' /> -->

<div class="editor-image">
	<div bind:this={drawing} on:click|preventDefault={handleClick}></div>
</div>
