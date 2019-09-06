<script context="module">

	const extractRectangles = (text) => {
		const textLines = text.split("\n");
		const lines = [];
		textLines.forEach(textline => {
			try {
				if (textline && textline !== "") {
					const rectsTextArray = Array.from(textline.matchAll(/\((.*?)\)/g)).map(el => el[1]);
					const line = [];
					rectsTextArray.forEach(textrect => {
						const nums = textrect.split(", ").map(el => +el);
						line.push({
							left: nums[0],
							top: nums[1],
							width: nums[2],
							height: nums[3]
						});
					});
					if (line.length > 0) {
						lines.push(line);
					}
				}
			} catch(e) {
				// ignore
			}
		});

		return lines;
	};

	export async function preload(page) {
		const imageLocation = '/image.jpg';
		const boundingRectsLocation = '/boundingrects.csv';

		const res = await this.fetch(boundingRectsLocation);
		const data = await res.text();
		const lines = extractRectangles(data);
		const rects = [];
		lines.forEach(line => {
			rects.push(...line);
		});

		return { imageName: imageLocation, rectangles: rects };
	}
</script>

<script>
	import { onMount } from 'svelte';
	import CharRectangle from '../components/CharRectangle.svelte';

	export let imageName = '';
	export let rectangles = [];
	let imageEl;
	let selectedRectangleIdx = 0;

	onMount(async () => {
		imageEl.style["background-image"] = `url(${imageName})`;
		const viewportWidth = imageEl.clientWidth;
		const ratio = imageEl.clientWidth / 2500;
		const dx = Math.floor(2500 * ratio / 2);
		const dy = Math.floor(1207 * ratio / 2);
		imageEl.style["transform"] = `scale(${ratio}) translate(-${dx}px, -${dy}px)`;
		imageEl.style["width"] = "2500px";
	});

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

<div on:dragover|preventDefault|stopPropagation=""
		on:drop|preventDefault|stopPropagation={handleDrop}
	>
	<!-- Image with Rectangles-->
	<div class="editor-image" bind:this={imageEl}>
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
Ctrl + Shift +  LeftArrow : to previous symbol in image"
		></textarea>
</div>
