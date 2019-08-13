<script>
	import BookCard from '../components/BookCard.svelte';
	import { onMount } from 'svelte';
	import { loadBooks, books } from '../stores/bookstore.js';

	onMount(async () => loadBooks());
</script>

<svelte:head>
	<title>Manuscripts Editor</title>
</svelte:head>

<div class="flex flex-wrap mb-2">
{#each $books as book}
	<BookCard {...book} />
{:else}
	<div class="text-center w-full">Loading ...</div>
{/each}
</div>
