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

	const handleKeyDownTextArea = (event) => {
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

<style>
	.editor-image {
		background-image: url('/Original.PNG');
		width: 1587px;
		height: 710px;
		position: relative;
	}

	textarea {
		position: fixed;
		top: 300px;
		left: 100px;
	}
</style>

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

​<textarea class="bg-gray-300"
					rows="10" cols="70"
					bind:value={textAreaText}
					on:keydown|stopPropagation={handleKeyDownTextArea}
	></textarea>
