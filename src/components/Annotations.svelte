<script>
	import CharRectangle from './CharRectangle.svelte';
	import { rectangles } from '../stores/annotationsstore.js';
</script>

{#each $rectangles as rectangle, i}
	<CharRectangle {...rectangle} idx={i} />
{/each}