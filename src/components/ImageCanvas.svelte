<script>
	import { tick } from 'svelte';
	import { imageAnnotations } from '../stores/annotationsstore.js';

	let imageEl;
	let lastAdjustedImage = '';

	const adjustImageDimensions = async () => {
		await tick();
		const imageName = `url(${$imageAnnotations.imageName})`;
		if (imageName === lastAdjustedImage) {
			return;
		}
		imageEl.style["background-image"] = imageName;
		const viewportWidth = imageEl.clientWidth;
		const ratio = imageEl.clientWidth / $imageAnnotations.imageWidth;
		imageEl.style["transform"] = `scale(${ratio})`;
		imageEl.style["width"] = `${$imageAnnotations.imageWidth}px`;
		imageEl.style["height"] = `${$imageAnnotations.imageHeight}px`;
		lastAdjustedImage = imageName;
	};

	imageAnnotations.subscribe(value => {
		if (value.loaded) {
			adjustImageDimensions();
		}
	});
</script>

<style>
	div {
		transform-origin: 0 0;
	}
</style>

<div class="w-full h-full" bind:this={imageEl}>
	<slot></slot>
</div>