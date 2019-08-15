<script>
	export let id = '';
	export let bookName = '';
	export let bookDescription = '';
	export let lastModified = '';
	export let isCreateCard = false;

	const isTheSameDay = (date1, date2) => {
		return date1.getFullYear() === date2.getFullYear()
			&& date1.getMonth() === date2.getMonth()
			&& date1.getDate() === date2.getDate();
	};

	const hoursFormatter = new Intl.DateTimeFormat('en', {
		hour12: true,
		hour: '2-digit',
		minute: '2-digit'
	});

	const daysFormatter = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const getTimestamp = (date) => {
		if (date) {
			const now = new Date();
			const cardDate = new Date(date);
			if (isTheSameDay(now, cardDate)) {
				return hoursFormatter.format(cardDate);
			} else {
				return daysFormatter.format(cardDate);
			}
		}
	};

	$: timestamp = getTimestamp(lastModified);
</script>

<style>
	.book-card {
		min-width: 24rem;
		max-width: 24rem;
	}
</style>

<div class="book-card bg-white flex flex-col p-6 m-2 border rounded border-gray-400 justify-center leading-normal">
	{#if isCreateCard}
		<a class="text-center w-full text-lg uppercase hover:underline text-indigo-600" href="book">New book</a>
	{:else}
    <div class="mb-8">
      <div class="text-black-900 uppercase font-bold text-xl mb-2">{bookName}</div>
      <p class="text-gray-700 text-base">{bookDescription}</p>
    </div>
    <div class="flex items-center">
      <img class="w-10 h-10 rounded-full mr-4" src="mantra.jpeg" alt="Gayatri Mantra">
      <div class="text-sm">
        <p class="text-gray-500">{timestamp}</p>
        <a class="leading-none inline-block hover:underline text-indigo-500" href=".">See more</a>
      </div>
    </div>
	{/if}
</div>