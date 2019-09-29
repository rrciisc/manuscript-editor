<script>
	import CharRectangle from './CharRectangle.svelte';
	import { rectangles, currentLine } from '../stores/annotationsstore.js';
</script>

<style>
	hr {
		position: absolute;
		width: 100%;
	}
</style>

<hr style="top: {$currentLine.bottom+10}px" />
{#each $currentLine.rectangles as rectangle, i}
	<CharRectangle {...rectangle} idx={i} />
{/each}
