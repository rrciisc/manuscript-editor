<script>
	import { onMount } from 'svelte';
	import { imageAnnotations } from '../stores/annotationsstore.js';
	import { users } from '../stores/usersstore.js';

	export let segment;
	onMount(async () => {
		document.addEventListener('keydown', event => {
			if (segment !== "editor") {
				return;
			}

			// enter : toggle visibility of annotations
			if (event.keyCode === 13) {
				imageAnnotations.toggleAnnotationsVisibility();
				event.preventDefault();
				event.stopPropagation();
				return;
			}
		});

		users.loadUsers();
	});
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>
<nav>
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>users</a></li>
		{#if segment === "adduser"}
			<li><a class='{segment === "adduser" ? "selected" : ""}' href='.'>add user</a></li>
		{:else if segment === "manuscripts"}
			<li><a class='{segment === "manuscripts" ? "selected" : ""}' href='.'>manuscripts</a></li>
		{:else if segment === "addmanuscript"}
			<li><a class='{segment === "addmanuscript" ? "selected" : ""}' href='.'>add manuscript</a></li>
		{:else if segment === "editor"}
			<li><a class='{segment === "editor" ? "selected" : ""}' href='.'>editor</a></li>
		{/if}
	</ul>
</nav>
