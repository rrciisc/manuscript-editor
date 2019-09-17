<script>
	import { selectedRectangleIdx } from '../stores/annotationsstore.js';

	export let top;
	export let left;
	export let width;
	export let height;
	export let idx;

	let box;
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

<div class="{$selectedRectangleIdx === idx ? 'focus' : ''}"
		style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
		bind:this={box}
	></div>
