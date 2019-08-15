<script>
	import BookCard from '../components/BookCard.svelte';
	import { books } from '../stores/bookstore.js';
</script>

<svelte:head>
	<title>Manuscripts Editor</title>
</svelte:head>

<div class="flex flex-wrap mb-2">
	{#if $books.length === 0}
		<div class="text-center w-full">Loading ...</div>
	{:else}
		{#each $books as book}
			<BookCard {...book} />
		{/each}
			<BookCard isCreateCard={true} />
	{/if}
</div>
