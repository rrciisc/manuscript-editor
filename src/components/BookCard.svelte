<script>
	export let id;
	export let bookName;
	export let bookDescription;
	export let lastModified;

	const isTheSameDay = (date1, date2) => {
		return date1.getFullYear() === date2.getFullYear()
			&& date1.getMonth() === date2.getMonth()
			&& date1.getDate() === date2.getDate();
	};

	const getTimestamp = (date) => {
		if (date) {
			const now = new Date();
			const cardDate = new Date(date);
			if (isTheSameDay(now, cardDate)) {
				return `${cardDate.getHours()}:${cardDate.getMinutes()}`;
			} else {
				return `${cardDate.getDate()}/${cardDate.getMonth()+1}/${cardDate.getFullYear()}`;
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

<div class="book-card flex bg-white rounded-lg p-6 shadow-md m-2">
	<img class="h-24 w-24 rounded-full mr-2" src="great-success.png" alt="Borat" />
	<div class="text-left">
		<h2 class="inline-block">
			<span class="text-lg uppercase text-black-500">{bookName}</span>
			<span class="text-xs text-gray-500">{timestamp}</span>
		</h2>
		<div class="text-sm text-gray-600">{bookDescription}</div>
		<a class="inline-block hover:underline pt-6 text-indigo-600" href="/">See more</a>
	</div>
</div>