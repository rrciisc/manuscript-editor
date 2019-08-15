import { getRequestHeaders, createDocument } from './utility.js';
import { writable } from 'svelte/store';

const STORAGE_ACCOUNT_ENDPOINT = "https://roopchoueditorapp.blob.core.windows.net";

let booksLoaded = false;
export const books = writable([]);

export const loadBooks = async () => {
	if (booksLoaded) {
		return;
	}

	const url = `${STORAGE_ACCOUNT_ENDPOINT}/?comp=list&prefix=book&include=metadata&maxresults=10`;
	const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			headers: getRequestHeaders()
		});

	const responseText = await response.text();
	const doc = createDocument(responseText);

	// update books store
	books.set(
		Array.prototype.map.call(
			doc.querySelectorAll('Containers > Container'),
			container => {
				return {
					id: container.querySelector('Name').textContent,
					lastModified: container.querySelector('Properties > Last-Modified').textContent,
					bookName: container.querySelector('Metadata > name').textContent,
					bookDescription: container.querySelector('Metadata > description').textContent
				};
			}
		)
	);
	booksLoaded = true;
};

export const createBook = async (bookName, bookDescription) => {
	console.log(`book create: ${bookName}, ${bookDescription}`);
};
