<script>
	import ReadonlyText from '../components/ReadonlyText.svelte';
	import ImageCanvas from  '../components/ImageCanvas.svelte';
	import Annotations from  '../components/Annotations.svelte';
	import { imageAnnotations } from '../stores/annotationsstore.js';

	let showAnnotations = true;
</script>

{#if !$imageAnnotations.loaded}
	<div class="text-center w-full">Loading ...</div>
{:else}
	<ReadonlyText />
	<ImageCanvas {showAnnotations} on:toggleRectangleVisibility="{ (e) => showAnnotations = e.detail.show }" >
		{#if showAnnotations}
			<Annotations />
		{/if}
	</ImageCanvas>
{/if}
