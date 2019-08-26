<script>
	import CharRectangle from '../components/CharRectangle.svelte';

	const rectangles = [];
	let left = 23;
	for (let i = 0; i < 10; i++) {
		rectangles.push({ top: 32, left: left, width: 48, height: 51 });
		left += 48;
	}

	let selectedRectangleIdx = 0;

	const handleClickRectangle = (event) => {
		if (event.detail.zoomed) {
			selectedRectangleIdx = event.detail.idx;
		} else {
			if (event.detail.idx < rectangles.length-1) {
				selectedRectangleIdx = selectedRectangleIdx+1;
			}
		}
	};

	let txtAreaEl;
	let textAreaText = '';

	const moveToNextPosition = () => {
		if (selectedRectangleIdx < rectangles.length-1) {
			selectedRectangleIdx++;
		}
	};

	const moveToPreviousPosition = () => {
		if (selectedRectangleIdx > 0) {
			selectedRectangleIdx--;
		}
	};

	const handleKeyDownTextArea = event => {
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

	const handleDrop = event => {
		const offset = event.dataTransfer.getData("text/plain").split(',');
		const relativeX = parseInt(offset[0], 10);
		const relativeY = parseInt(offset[1], 10);
    txtAreaEl.style.left = `${event.clientX + relativeX}px`;
    txtAreaEl.style.top = `${event.clientY + relativeY}px`;
	};
</script>

<style>
	.editor-image {
		background-image: url('/Original.PNG');
		width: 1587px;
		height: 710px;
		position: relative;
	}

	textarea {
		position: fixed;
		top: 400px;
		left: 50px;
	}
</style>

<div on:dragover|preventDefault|stopPropagation=""
		on:drop|preventDefault|stopPropagation={handleDrop}
	>
	<!-- Image with Rectangles-->
	<div class="editor-image">
		{#each rectangles as rectangle, i}
			<CharRectangle
				{...rectangle}
				selected={selectedRectangleIdx === i}
				idx={i}
				on:clickRectangle={handleClickRectangle}
			/>
		{/each}
	</div>
	<!-- Text Area to capture user input -->
​	<textarea class="bg-gray-300"
						rows="10" cols="70"
						bind:value={textAreaText}
						on:keydown|stopPropagation={handleKeyDownTextArea}
						draggable="true"
						bind:this={txtAreaEl}
						on:dragstart={handleDragStart}
		></textarea>
</div>
