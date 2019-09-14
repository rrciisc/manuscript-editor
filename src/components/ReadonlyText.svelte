<!-- Text Area to capture user input -->
<script>
	export let moveToPreviousPosition = () => {};
	export let moveToNextPosition = () => {};
	let txtAreaEl;
	let textAreaText = '';

	const handleKeyDown = event => {
		// Shift+Ctrl+ArrowRight
		if (event.shiftKey && event.ctrlKey && event.keyCode === 39) {
			moveToNextPosition();
			event.preventDefault();
		}
		// Shift+Ctrl+ArrowLeft
		if (event.shiftKey && event.ctrlKey && event.keyCode === 37) {
			moveToPreviousPosition();
			event.preventDefault();
		}
	};
</script>

<textarea class="label-input resize w-full"
						rows="10"
						bind:this={txtAreaEl}
						bind:value={textAreaText}
						on:keydown|stopPropagation={handleKeyDown}
						placeholder=
"Enter text in this area

Navigate using
Ctrl + Shift + RightArrow : to next symbol in image
Ctrl + Shift +  LeftArrow : to previous symbol in image"></textarea>
