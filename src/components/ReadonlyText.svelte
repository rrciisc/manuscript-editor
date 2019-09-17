<!-- Text Area to capture user input -->
<script>
	import { imageAnnotations } from '../stores/annotationsstore.js';

	let txtAreaEl;
	let textAreaText = '';

	const handleKeyDown = event => {
		// Shift+Ctrl+ArrowRight
		if (event.shiftKey && event.ctrlKey && event.keyCode === 39) {
			imageAnnotations.moveToNextRectangle();
			event.preventDefault();
		}
		// Shift+Ctrl+ArrowLeft
		if (event.shiftKey && event.ctrlKey && event.keyCode === 37) {
			imageAnnotations.moveToPreviousRectangle();
			event.preventDefault();
		}
	};
</script>

<style>
textarea {
	height: 25vh;
}
</style>

<textarea class="label-input resize w-full"
						bind:this={txtAreaEl}
						bind:value={textAreaText}
						on:keydown|stopPropagation={handleKeyDown}
						placeholder=
"Enter text in this area

Navigate using
Ctrl + Shift + RightArrow : to next symbol in image
Ctrl + Shift +  LeftArrow : to previous symbol in image"></textarea>
