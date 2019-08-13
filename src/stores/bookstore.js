import { getRequestHeaders, createDocument } from './utility.js';
import { writable } from 'svelte/store';

const STORAGE_ACCOUNT_ENDPOINT = "https://roopchoueditorapp.blob.core.windows.net";

export const count = writable(0);

export const getBooks = async () => {
	const url = `${STORAGE_ACCOUNT_ENDPOINT}/?comp=list&prefix=book&include=metadata&maxresults=10`;
	const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			headers: getRequestHeaders()
		});
		const responseText = await response.text();
		const doc = createDocument(responseText);
		return Array.prototype.map.call(
			doc.querySelectorAll('Containers > Container'),
			container => {
				return {
					id: container.querySelector('Name').textContent,
					lastModified: container.querySelector('Properties > Last-Modified').textContent,
					bookName: container.querySelector('Metadata > name').textContent,
					bookDescription: container.querySelector('Metadata > description').textContent
				};
			}
		);
};