<script context="module">
	import { STORAGE_ACCOUNT_ENDPOINT } from '../stores/bookstore.js';

	export async function preload(page) {
		const { id, bookName } = page.query;
		const pdfUrl = `${STORAGE_ACCOUNT_ENDPOINT}/${id}/pdf`;
		return { pdfUrl, bookName };
 }
</script>

<script>
	import { onMount } from 'svelte';

	export let pdfUrl = '';
	export let bookName = '';
	let pdfCanvas;
	let componentReady = false;

	const onReadyCallback = async () => {
		console.log('Reader component mounted');
		if (!pdfUrl) {
			return;
		}

		const pdfjsLib = window['pdfjs-dist/build/pdf'];
		// Asynchronous download of PDF
		const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
		console.log(`pdf ${pdfUrl} loaded`);
		// Fetch the first page
		const pdfPage = await pdfDoc.getPage(1);
		console.log('First Page loaded');
		// Prepare canvas using PDF page dimensions
		const viewport = pdfPage.getViewport({ scale: 1.5 });
		pdfCanvas.width = viewport.width;
		pdfCanvas.height = viewport.height;
		const canvasContext = pdfCanvas.getContext('2d');

		// render pdf page into canvas context
		pdfPage.render({ canvasContext, viewport }).promise.then(() => {
			componentReady = true;
			console.log('Page rendered');
		});
	};

	const timeout = async (ms) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	onMount(async () => {
		// wait for pdf-js library to be loaded on client
		while (!window['pdfjs-dist/build/pdf']) {
			await timeout(100);
		}
		onReadyCallback();
	});
</script>

<style>
	.hide {
		visibility: hidden;
	}
</style>

<h2 class="text-center w-full mb-8">Book Name: {bookName}</h2>

{#if !componentReady}
	<div class="text-center w-full">Loading ...</div>
{/if}
<canvas class="{!componentReady ? 'hide' : ''} text-center w-full"
	bind:this={pdfCanvas}>
</canvas>