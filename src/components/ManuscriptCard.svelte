<script>
	export let id = null;
	export let imageUrl = '';
	export let lastModified = '';
	export let width = '';
	export let height = '';
	export let isCreateCard = false;
</script>

<style>
	.card {
		min-width: 20rem;
		max-width: 20rem;
	}
</style>

{#if isCreateCard}
<div class="card bg-white flex flex-col p-6 m-2 border rounded border-gray-400 justify-center leading-normal">
	<a class="text-center w-full text-lg uppercase hover:underline text-indigo-600" href="addmanuscript">Add New</a>
</div>
{:else}
	<div class="card bg-white flex flex-row border rounded border-gray-400 leading-normal">
		<img class="w-64 mr-6" src="{imageUrl}" alt="Avatar of Manuscript Image">
		<div class="text-sm justify-center mt-6">
			<a class="leading-none inline-block hover:underline text-indigo-500" href="editor?id={id}&imageUrl={imageUrl}">{id}</a>
		</div>
	</div>
{/if}
