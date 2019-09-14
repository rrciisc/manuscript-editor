<script>
	import { onMount, tick } from 'svelte';
	import CharRectangle from '../components/CharRectangle.svelte';
	import { imageAnnotations, rectangles } from '../stores/annotationsstore.js';

	let imageEl;
	let selectedRectangleIdx = 0;

	const adjustImageDimensions = async () => {
		await tick();
		imageEl.style["background-image"] = `url(${$imageAnnotations.imageName})`;
		const viewportWidth = imageEl.clientWidth;
		const ratio = imageEl.clientWidth / 2500;
		const dx = Math.floor(2500 * ratio / 2);
		const dy = Math.floor(1207 * ratio / 2);
		imageEl.style["transform"] = `scale(${ratio}) translate(-${dx}px, -${dy}px)`;
		imageEl.style["width"] = "2500px";
	};

	onMount(async () => {
		imageAnnotations.subscribe(value => {
			if (value.loaded) {
				adjustImageDimensions();
			}
		});
	});

	const handleClickRectangle = (event) => {
		if (event.detail.zoomed) {
			selectedRectangleIdx = event.detail.idx;
		} else {
			if (event.detail.idx < $rectangles.length-1) {
				selectedRectangleIdx = selectedRectangleIdx+1;
			}
		}
	};

	let txtAreaEl;
	let textAreaText = '';

	const moveToNextPosition = () => {
		if (selectedRectangleIdx < $rectangles.length-1) {
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
		width: 100%;
		height: 1207px;
		position: relative;
	}

	textarea {
		position: fixed;
		top: 400px;
		left: 50px;
	}
</style>
{#if !$imageAnnotations.loaded}
	<div class="text-center w-full">Loading ...</div>
{:else}
<div on:dragover|preventDefault|stopPropagation=""
		on:drop|preventDefault|stopPropagation={handleDrop}
	>
	<!-- Image with Rectangles-->
	<div class="editor-image" bind:this={imageEl}>
		{#each $rectangles as rectangle, i}
			<CharRectangle
				{...rectangle}
				selected={selectedRectangleIdx === i}
				idx={i}
				on:clickRectangle={handleClickRectangle}
			/>
		{/each}
	</div>
	<!-- Text Area to capture user input -->
​	<textarea class="label-input resize"
						rows="10" cols="70"
						bind:value={textAreaText}
						on:keydown|stopPropagation={handleKeyDownTextArea}
						draggable="true"
						bind:this={txtAreaEl}
						on:dragstart={handleDragStart}
						placeholder=
"Enter text in this area

This area is draggable and resizable for you to configure it as you want

Navigate using
Ctrl + Shift + RightArrow : to next symbol in image
Ctrl + Shift +  LeftArrow : to previous symbol in image"></textarea>
</div>
{/if}
