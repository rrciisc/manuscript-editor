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
	let componentReady = false;

	// pdf state
	let pdfCanvas;
	let pdfDoc = null;
	let currentPageNumber = '';
	let totalPages = '';
	let pageRendering = false;
	let pageNumPending = null;
	let canvasContext = null;

	/**
	 * Get page info from document and render page.
	 * @param num Page number
	 */
	const renderPage = async (num) => {
		pageRendering = true;
		currentPageNumber = num;
		const pdfPage = await pdfDoc.getPage(num);
		console.log(`Page (${num}) loaded`);
		const viewport = pdfPage.getViewport({ scale: 1.5 });
		pdfCanvas.height = viewport.height;
		pdfCanvas.width = viewport.width;

		await pdfPage.render({ canvasContext, viewport });
		console.log(`Page (${num}) rendered`);
		pageRendering = false;
		if (pageNumPending !== null) {
			renderPage(pageNumPending);
			pageNumPending = null;
		}
	};

	/**
	 * If another page rendering in progress, waits until the rendering is
	 * finised. Otherwise, executes rendering immediately.
	 */
	const queueRenderPage = (num) => {
	  if (pageRendering) {
	    pageNumPending = num;
	  } else {
	    renderPage(num);
	  }
	};

	const onReadyCallback = async () => {
		console.log('Reader component mounted');
		if (!pdfUrl) { return; }

		const pdfjsLib = window['pdfjs-dist/build/pdf'];
		// Asynchronous download of PDF
		pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
		console.log(`pdf ${pdfUrl} loaded`);
		totalPages = pdfDoc.numPages;
		canvasContext = pdfCanvas.getContext('2d');
		await renderPage(1);
		componentReady = true;
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

	const handlePrevious = (event) => {
		if (currentPageNumber <= 1) { return; }
		queueRenderPage(currentPageNumber-1);
	};
	const handleNext = (event) => {
		if (currentPageNumber >= totalPages) { return; }
		queueRenderPage(currentPageNumber+1);
	};
</script>

<style>
	.hide {
		visibility: hidden;
	}
</style>

{#if !componentReady}
	<div class="text-center w-full">Loading ...</div>
{:else}
	<div class="text-center w-full mb-8">
  <button class="leading-none inline-block hover:underline text-indigo-500" on:click|preventDefault={handlePrevious}>Previous</button>
  <button class="leading-none inline-block hover:underline text-indigo-500" on:click|preventDefault={handleNext}>Next</button>
  &nbsp; &nbsp;
  <span>Page: <span>{currentPageNumber}</span> / <span>{totalPages}</span></span>
	&nbsp; &nbsp;
	<span>Book Name: <em>{bookName}</em></span>
</div>
{/if}
<canvas class="{!componentReady ? 'hide' : ''} text-center w-full"
	bind:this={pdfCanvas}>
</canvas>