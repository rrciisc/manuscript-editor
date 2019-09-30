<script>
	export let id = '';
	export let userName = '';
	export let lastModified = '';
	export let container = '.';
	export let isCreateCard = false;

	let userHref = 'adduser';
	let classes = 'text-center w-full text-lg uppercase hover:underline text-indigo-600';
	let displayName = 'New User';
	if (!isCreateCard) {
		userHref = `manuscripts?id=${id}&userName=${userName}`;
		classes = 'text-center w-full text-xl hover:underline text-black-900 font-bold';
		displayName = userName;
	}
</script>

<style>
	.card {
		min-width: 24rem;
		max-width: 24rem;
	}
</style>

<div class="card bg-white flex flex-col p-6 m-2 border rounded border-gray-400 justify-center leading-normal">
	<a class="{classes}" href="{userHref}">{displayName}</a>
</div>
