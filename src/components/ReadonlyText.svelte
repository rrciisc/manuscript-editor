<!-- Text Area to capture user input -->
<script>
	import { annotatedData } from '../stores/annotationsstore.js';
</script>

<style>
textarea {
	height: 20vh;
}
</style>

<textarea class="label-input resize w-full"
						readonly
						value={$annotatedData}></textarea>
