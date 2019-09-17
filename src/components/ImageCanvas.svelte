<script>
	import { tick, createEventDispatcher } from 'svelte';
	import { imageAnnotations } from '../stores/annotationsstore.js';

	const dispatch = createEventDispatcher();

	const zoomLevels = [
		{ id: 0, text: 'Screen Width' },
		{ id: 0.5, text: 'Half Size' },
		{ id: 1, text: 'Actual Size' },
		{ id: 2, text: '2x' },
		{ id: 4, text: '4x' }
	];
	let selectedZoomLevel;
	export let showAnnotations = true;

	const handleCheckboxToggle = (_event) => {
		dispatch('toggleRectangleVisibility', { show: showAnnotations });
	};

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

<div class="flex items-stretch justify-between">
	<span class="self-start">
		<label class="label">Zoom Level: </label>
		<select class="bg-gray-100" bind:value={selectedZoomLevel} on:change="{() => setZoomLevel(selectedZoomLevel)}">
			{#each zoomLevels as zoomLevel}
				<option value={zoomLevel}>{zoomLevel.text}</option>
			{/each}
		</select>
	</span>
	<span class="self-end">
		<label class="label">Show Annotations: </label>
		<input type="checkbox" bind:checked={showAnnotations} on:change="{() => handleCheckboxToggle()}" />
	</span>
</div>
<div class="h-full w-full overflow-scroll" id="container">
	<div class="h-full overflow-x-scroll" id="canvas" bind:this={imageEl}>
		<slot></slot>
	</div>
</div>