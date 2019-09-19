<script>
	import ReadonlyText from '../components/ReadonlyText.svelte';
	import ImageCanvas from  '../components/ImageCanvas.svelte';
	import Annotations from  '../components/Annotations.svelte';
	import { imageAnnotations } from '../stores/annotationsstore.js';
</script>

{#if !$imageAnnotations.loaded}
	<div class="text-center w-full">Loading ...</div>
{:else}
<div>
	<ReadonlyText />
	<ImageCanvas>
		{#if $imageAnnotations.showAnnotations}
			<Annotations />
		{/if}
	</ImageCanvas>
</div>
{/if}
