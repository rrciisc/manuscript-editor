import { getHeaders, createDocument } from './utility.js';
import { writable } from 'svelte/store';

const STORAGE_ACCOUNT_ENDPOINT = "https://roopchoueditorapp.blob.core.windows.net";

export const library = writable({ books: [], loaded: false, latestBookId: 0 });

const getLibraryField = (key) => {
	let ans = undefined;
	library.update(lib => {
		ans = lib[key];
		return lib;
	});
	return ans;
};

const isLibraryLoaded = () => getLibraryField('loaded');
const getLatestBookId = () => getLibraryField('latestBookId');

export const loadBooks = async () => {
	if (isLibraryLoaded()) { return; }

	const url = `${STORAGE_ACCOUNT_ENDPOINT}/?comp=list&prefix=book&include=metadata&maxresults=10`;
	const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache', headers: getHeaders('loadbooks') });
	const responseText = await response.text();
	const loadedBooks = Array.prototype.map.call(
			createDocument(responseText).querySelectorAll('Containers > Container'),
			container => {
				let book = {
					id: container.querySelector('Name').textContent,
					lastModified: container.querySelector('Properties > Last-Modified').textContent,
					bookName: container.querySelector('Metadata > name').textContent,
					bookDescription: container.querySelector('Metadata > description').textContent
				};
				book['pdfLink'] = `${STORAGE_ACCOUNT_ENDPOINT}/${book.id}/pdf`;
				return book;
			}
		);

	let latestBookId = 0;
	loadedBooks.sort((a, b) => Number(a.id.substr(5)) - Number(b.id.substr(5)));
	if (loadedBooks.length > 0) {
		const latestBook = loadedBooks[loadedBooks.length - 1];
		latestBookId = Number(latestBook.id.substr(5));
	}

	library.set({ books: loadedBooks, loaded: true, latestBookId: latestBookId });
};

export const createBook = async (bookName, bookDescription, fileData) => {
	if (!isLibraryLoaded()) {
		console.warn('book store not yet ready for new book creation.');
		return;
	}

	const bookId = `book-${getLatestBookId()+1}`;
	const url = `${STORAGE_ACCOUNT_ENDPOINT}/${bookId}?restype=container`;
	const response = await fetch(url, { method: 'PUT', mode: 'cors', cache: 'no-cache',
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

		// upload file
		const uploadUrl = `${STORAGE_ACCOUNT_ENDPOINT}/${bookId}/pdf`;
		const uploadResponse = await fetch(uploadUrl, { method: 'PUT', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('uploadbook', {bookId}), body: fileData
		});

		if (uploadResponse.status !== 201) {
			console.error(`book file upload failed: ${response.status}`);
		} else {
			newBook['pdfLink'] = `${STORAGE_ACCOUNT_ENDPOINT}/${newBook.id}/pdf`;
			library.update(lib => {
				lib.books = [...lib.books, newBook];
				lib.latestBookId += 1;
				return lib;
			});
		}
	}
};
