<script>
	import { tick, onMount } from 'svelte';
	import { selectedRectangleIdx, imageAnnotations, currentLine } from '../stores/annotationsstore.js';

	export let top;
	export let left;
	export let width;
	export let height;
	export let idx;
	export let data;

	$: linebottom = $currentLine.bottom;

	let box; let inputBox; let line;
	let boxClass = '';

	const createLineElement = (x, y, length, angle) => {
		const line = document.createElement("div");
		const styles = 'width: ' + length + 'px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
							 + 'left: ' + x + 'px; '
							 + 'padding: 0px; margin: 0px; height: 1px; line-height: 1px; background-color: greenyellow; ';
    line.setAttribute('style', styles);  
    return line;
	};

	const createLine = (x1, y1, x2, y2) => {
		let a = x1 - x2;
		let b = y1 - y2;
		let c = Math.sqrt(a * a + b * b);

		let sx = (x1 + x2) / 2;
		let sy = (y1 + y2) / 2;

		let x = sx - c / 2;
		let y = sy;
		let alpha = Math.PI - Math.atan2(-b, a);

		return createLineElement(x, y, c, alpha);
	};

	// TODO: below connected line code have some issue so not using
	const bringTextIntoFocus = async () => {
		if ($imageAnnotations.selectedColumn === idx) {
			boxClass = 'focus';
			if (box) {
				box.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
				await tick();
				if (inputBox && !line) {
					const aRect = box.getBoundingClientRect();
					const bRect = inputBox.getBoundingClientRect();
					const offsetY = bRect.top + bRect.height - aRect.top;
					const offsetX = bRect.left - aRect.left;
					line = createLine(aRect.width, 0, offsetX, offsetY);
					await tick();
					box.appendChild(line);
				}
			}
		} else {
			boxClass = '';
		}
	};

	const setFocus = async () => {
		await tick();
		inputBox && inputBox.focus();
	};

	$: if ($imageAnnotations.selectedColumn === idx) {
		boxClass = 'focus';
		box && box.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
		setFocus();
	} else {
		boxClass = '';
	}

	const handleKeyDown = event => {
		// Space
		if (!event.shiftKey && event.keyCode === 32) {
			imageAnnotations.moveToNextRectangle(data);
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		// Shift+Space
		if (event.shiftKey && event.keyCode === 32) {
			imageAnnotations.moveToPreviousRectangle(data);
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		// ignore Enter key as that is consumed by global event listener to toggle rectangles visibility
		if (event.keyCode === 13) {
			return;
		}
	};
</script>

<style>
	div {
		position: absolute;
		border-style: solid;
		border-width: 1px;
		border-color: white;
	}

	.focus {
		border-color: greenyellow;
		transform: scale(1.5);
	}

	input {
		z-index: 10;
		position: absolute;
	}
</style>

<div class="{boxClass}"
	style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
	bind:this={box}
></div>
<input class="appearance-none {boxClass === 'focus' ? '' : 'hidden'} leading-tight w-12 h-12 px-1 py-1 absolute bg-purple-200"
	style="top: {linebottom+10}px; left: {left}px"
	type="text" bind:this={inputBox}
	on:keydown={handleKeyDown}
	bind:value={data} />
