<script>
	import { onMount } from 'svelte';
	import { loadImageAnnotations, imageAnnotations } from '../stores/annotationsstore.js';

	export let segment;
	onMount(async () => {
		document.addEventListener('keydown', event => {
			// enter : toggle visibility of annotations
			if (event.keyCode === 13) {
				imageAnnotations.toggleAnnotationsVisibility();
				event.preventDefault();
				event.stopPropagation();
				return;
			}
		});

		loadImageAnnotations();
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
<nav class="hidden">
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>editor</a></li>
	</ul>
</nav>
