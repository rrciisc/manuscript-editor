<script>
	import { createEventDispatcher } from 'svelte';

	export let top;
	export let left;
	export let width;
	export let height;
	export let idx;
	export let selected = false;

	const dispatch = createEventDispatcher();

	const handleClick = (_event) => {
		selected = !selected;
		dispatch('clickRectangle', { idx: idx, zoomed: selected });
	};
</script>

<style>
	div {
		position: absolute;
		border-style: solid;
		border-width: 1px;
		border-color: white;
	}

	.zoom {
		border-color: greenyellow;
		border-width: 2px;
		transform: scale(1.5);
	}
</style>

<div class="{selected ? 'zoom' : ''}"
		style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
		on:click|preventDefault|stopPropagation={handleClick}
	></div>
