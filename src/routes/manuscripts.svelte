<script context="module">
	export async function preload(page) {
		const {id, userName} = page.query;
		return {id, userName};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { manuscripts } from '../stores/manuscriptsstore.js';
	import ManuscriptCard from '../components/ManuscriptCard.svelte';

	export let id = '';
	export let userName = '';

	onMount(async () => {
		manuscripts.loadManuscripts(id);
	});
</script>

<div class="flex flex-wrap mb-2">
	{#if !$manuscripts.loaded}
		<div class="text-center w-full">Loading ...</div>
	{:else}
		{#each $manuscripts.manuscripts as manuscript}
			<ManuscriptCard {...manuscript} />
		{/each}
		<ManuscriptCard isCreateCard={true} />
	{/if}
</div>
