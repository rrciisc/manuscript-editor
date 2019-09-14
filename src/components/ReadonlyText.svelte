<!-- Text Area to capture user input -->
<script>
	export let moveToPreviousPosition = () => {};
	export let moveToNextPosition = () => {};
	export let locationLeft = 50;
	export let locationTop = 400;
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

	const handleDragStart = event => {
		const style = window.getComputedStyle(event.target, null);
		const relativeX = parseInt(style.getPropertyValue("left"), 10) - event.clientX;
		const relativeY = parseInt(style.getPropertyValue("top"), 10) - event.clientY;
    event.dataTransfer.setData("text/plain", `${relativeX},${relativeY}`);
	};

	const handleDragOver = event => {
		event.preventDefault();
		return false;
	};

	$: {
		if (txtAreaEl && txtAreaEl.style) {
			txtAreaEl.style.left = `${locationLeft}px`;
			txtAreaEl.style.top = `${locationTop}px`;
		}
	}
</script>

<style>
	textarea {
		position: fixed;
	}
</style>

<textarea class="label-input resize"
						rows="10" cols="70"
						bind:this={txtAreaEl}
						bind:value={textAreaText}
						on:keydown|stopPropagation={handleKeyDown}
						draggable="true"
						on:dragstart={handleDragStart}
						placeholder=
"Enter text in this area

This area is draggable and resizable for you to configure it as you want

Navigate using
Ctrl + Shift + RightArrow : to next symbol in image
Ctrl + Shift +  LeftArrow : to previous symbol in image"></textarea>
