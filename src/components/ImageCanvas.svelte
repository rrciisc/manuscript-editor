<script>
	import { tick } from 'svelte';
	import { imageAnnotations } from '../stores/annotationsstore.js';

	const zoomLevels = [
		{ id: 0, text: 'Page Width' },
		{ id: 0.5, text: '50%' },
		{ id: 1, text: '100%' },
		{ id: 2, text: '200%' },
		{ id: 4, text: '400%' }
	];
	let selectedZoomLevel;

	let imageEl;
	let viewportWidth;

	const setZoomLevel = (zoomLevel) => {
		let ratio = viewportWidth / $imageAnnotations.imageWidth;
		if (zoomLevel.id !== 0) {
			ratio = zoomLevel.id;
		}
		imageEl.style["transform"] = `scale(${ratio})`;
	};

	const initCanvas = async () => {
		if (viewportWidth) { return; }
		await tick();
		imageEl.style["background-image"] = `url(${$imageAnnotations.imageName})`;
		viewportWidth = imageEl.clientWidth;
		setZoomLevel(zoomLevels[0]);	// page-width level
		imageEl.style["width"] = `${$imageAnnotations.imageWidth}px`;
		imageEl.style["height"] = `${$imageAnnotations.imageHeight}px`;
	};

	imageAnnotations.subscribe(value => {
		if (value.loaded) {
			initCanvas();
		}
	});
</script>

<style>
	#canvas {
		transform-origin: 0 0;
	}
	#container {
		height: 65vh;
	}
</style>

<select class="bg-gray-100" bind:value={selectedZoomLevel} on:change="{() => setZoomLevel(selectedZoomLevel)}">
	{#each zoomLevels as zoomLevel}
		<option value={zoomLevel}>{zoomLevel.text}</option>
	{/each}
</select>
<div class="h-full w-full overflow-scroll" id="container">
	<div class="h-full overflow-x-scroll" id="canvas" bind:this={imageEl}>
		<slot></slot>
	</div>
</div>