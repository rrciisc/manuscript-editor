<script>
	import BookCard from '../components/BookCard.svelte';
	import { library } from '../stores/bookstore.js';
</script>

<svelte:head>
	<title>Manuscripts Editor</title>
</svelte:head>

<div class="flex flex-wrap mb-2">
	{#if !$library.loaded}
		<div class="text-center w-full">Loading ...</div>
	{:else}
		{#each $library.books as book}
			<BookCard {...book} />
		{/each}
			<BookCard isCreateCard={true} />
	{/if}
</div>
