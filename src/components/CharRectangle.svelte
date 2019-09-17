<script>
	import { selectedRectangleIdx } from '../stores/annotationsstore.js';

	export let top;
	export let left;
	export let width;
	export let height;
	export let idx;

	let box;
	let boxClass = '';
	$: if ($selectedRectangleIdx === idx) {
		boxClass = 'focus';
		box && box.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
	} else {
		boxClass = '';
	}
</script>

<style>
	div {
		position: absolute;
		border-style: solid;
		border-width: 1px;
		border-color: white;
	}

	.focus {
		border-color: greenyellow;
	}
</style>

<div class="{boxClass}"
		style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
		bind:this={box}
	></div>
