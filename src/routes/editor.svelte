<script context="module">
	export async function preload(page) {
		const {id, userId} = page.query;
		return {id: Number(id), userId};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { manuscripts } from '../stores/manuscriptsstore.js';
	import { loadImageAnnotations, imageAnnotations } from '../stores/annotationsstore.js';

	import ReadonlyText from '../components/ReadonlyText.svelte';
	import ImageCanvas from  '../components/ImageCanvas.svelte';
	import Annotations from  '../components/Annotations.svelte';

	export let id = '';
	export let userId = '';

	onMount(async () => {
		loadImageAnnotations(userId, id);
	});
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
