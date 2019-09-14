<script>
	import { onMount, tick } from 'svelte';
	import CharRectangle from '../components/CharRectangle.svelte';
	import ReadonlyText from '../components/ReadonlyText.svelte';
	import { imageAnnotations, rectangles } from '../stores/annotationsstore.js';

	let imageEl;
	let selectedRectangleIdx = 0;

	const adjustImageDimensions = async () => {
		await tick();
		imageEl.style["background-image"] = `url(${$imageAnnotations.imageName})`;
		const viewportWidth = imageEl.clientWidth;
		const ratio = imageEl.clientWidth / $imageAnnotations.imageWidth;
		imageEl.style["transform"] = `scale(${ratio})`;
		imageEl.style["width"] = `${$imageAnnotations.imageWidth}px`;
		imageEl.style["height"] = `${$imageAnnotations.imageHeight}px`;
	};

	onMount(async () => {
		imageAnnotations.subscribe(value => {
			if (value.loaded) {
				adjustImageDimensions();
			}
		});
	});

	const handleClickRectangle = (event) => {
		if (event.detail.zoomed) {
			selectedRectangleIdx = event.detail.idx;
		} else {
			if (event.detail.idx < $rectangles.length-1) {
				selectedRectangleIdx = selectedRectangleIdx+1;
			}
		}
	};

	const moveToNextPosition = () => {
		if (selectedRectangleIdx < $rectangles.length-1) {
			selectedRectangleIdx++;
		}
	};
	const moveToPreviousPosition = () => {
		if (selectedRectangleIdx > 0) {
			selectedRectangleIdx--;
		}
	};
</script>

<style>
	.editor-image {
		transform-origin: 0 0;
	}
</style>
{#if !$imageAnnotations.loaded}
	<div class="text-center w-full">Loading ...</div>
{:else}
	<ReadonlyText {moveToNextPosition} {moveToPreviousPosition} />
	<!-- Image with Rectangles-->
	<div class="editor-image w-full h-full" bind:this={imageEl}>
		{#each $rectangles as rectangle, i}
			<CharRectangle
				{...rectangle}
				selected={selectedRectangleIdx === i}
				idx={i}
				on:clickRectangle={handleClickRectangle}
			/>
		{/each}
	</div>
{/if}
