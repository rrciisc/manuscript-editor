import { getHeaders, createDocument } from './utility.js';
import { writable } from 'svelte/store';

const STORAGE_ACCOUNT_ENDPOINT = "https://roopchoueditorapp.blob.core.windows.net";

let booksLoaded = false;
let latestBookId = 0;
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
			headers: getHeaders('loadbooks')
		});

	const responseText = await response.text();
	const loadedBooks = Array.prototype.map.call(
			createDocument(responseText).querySelectorAll('Containers > Container'),
			container => {
				return {
					id: container.querySelector('Name').textContent,
					lastModified: container.querySelector('Properties > Last-Modified').textContent,
					bookName: container.querySelector('Metadata > name').textContent,
					bookDescription: container.querySelector('Metadata > description').textContent
				};
			}
		);
	loadedBooks.sort((a, b) => Number(a.id.substr(5)) - Number(b.id.substr(5)));
	if (loadedBooks.length > 0) {
		const latestBook = loadedBooks[loadedBooks.length - 1];
		latestBookId = Number(latestBook.id.substr(5));
	}

	books.set(loadedBooks);
	booksLoaded = true;
};

export const createBook = async (bookName, bookDescription) => {
	if (!booksLoaded) {
		console.warn('book store not yet ready for new book creation.');
		return;
	}

	const bookId = `book-${latestBookId+1}`;
	const url = `${STORAGE_ACCOUNT_ENDPOINT}/${bookId}?restype=container`;
	const response = await fetch(url, {
		method: 'PUT',
		mode: 'cors',
		cache: 'no-cache',
		headers: getHeaders('createbook', {bookName, bookDescription, bookId})
	});
	if (response.status !== 201) {
		console.error(`book creation failed: ${response.status}`);
	} else {
		let lastModified = '';
		response.headers.forEach((val, key) => {
			if (key.toLowerCase() === "last-modified") {
				lastModified = val;
			}
		});
		const newBook = { id: bookId, bookName, bookDescription, lastModified };
		books.update(n => [...n, newBook]);
	}
};
