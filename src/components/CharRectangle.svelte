<script>
	import { createEventDispatcher } from 'svelte';

	export let top;
	export let left;
	export let width;
	export let height;
	export let idx;
	export let selected = false;

	let box;
	const dispatch = createEventDispatcher();

	const handleClick = (_event) => {
		selected = !selected;
		dispatch('clickRectangle', { idx: idx, zoomed: selected });
	};

	$: if (selected && box) {
		box.style.backgroundPositionX = `-${left}px`;
		box.style.backgroundPositionY = `-${top}px`;
	}
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
		transform: scale(2);
		background-image: url('/Original.PNG');
		z-index: 1000;
	}
</style>

<div class="{selected ? 'zoom' : ''}"
		style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
		on:click|preventDefault|stopPropagation={handleClick}
		bind:this={box}
	></div>
