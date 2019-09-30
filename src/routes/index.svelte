<script>
	import { users } from '../stores/usersstore.js';
	import UserCard from '../components/UserCard.svelte';
</script>

<div class="flex flex-wrap mb-2">
	{#if !$users.loaded}
		<div class="text-center w-full">Loading ...</div>
	{:else}
		{#each $users.users as user}
			<UserCard {...user} />
		{/each}
		<UserCard isCreateCard={true} />
	{/if}
</div>
