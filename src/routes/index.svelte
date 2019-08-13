<script>
	import BookCard from '../components/BookCard.svelte';
	import { onMount } from 'svelte';
	import { getBooks } from '../stores/bookstore.js';

	let books = [];

	onMount(async () => {
		books = await getBooks();
		console.log(books);
	});
</script>

<svelte:head>
	<title>Manuscripts Editor</title>
</svelte:head>

<BookCard />
