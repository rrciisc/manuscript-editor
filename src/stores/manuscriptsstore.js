import { getHeaders, LOAD_MANUSCRIPTS_URL, createDocument, IMAGE_URL } from './azureutility.js';
import { writable } from 'svelte/store';

const createManuscriptsStore = () => {
	const { subscribe, set, update } = writable({
		manuscripts: [],
		loaded: false,
		latestManuscriptId: 0,
		userId: ''
	});

	const getField = (key) => {
		let ans = undefined;
		update(s => { ans = s[key]; return s; });
		return ans;
	};

	const areLoaded = () => getField('loaded');
	const getLatestId = () => getField('latestManuscriptId');
	const getUserId = () => getField('userId');

	const loadManuscripts = async (userId) => {
		set({ manuscripts: [], loaded: false, latestManuscriptId: 0, userId: '' });

		const response = await fetch(LOAD_MANUSCRIPTS_URL(userId), { method: 'GET', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('loadmanuscripts', {userId}) });
		const responseText = await response.text();
		const loadedManuscripts = Array.prototype.map.call(
			createDocument(responseText).querySelectorAll('Blobs > Blob'),
			blob => {
				let manuscript = {
					imageUrl: IMAGE_URL(userId, blob.querySelector('Name').textContent),
					lastModified: blob.querySelector('Properties > Last-Modified').textContent,
					width: blob.querySelector('Metadata > width').textContent,
					height: blob.querySelector('Metadata > height').textContent,
					id: blob.querySelector('Metadata > id').textContent
				};

				if (manuscript.width) {
					manuscript.width = Number(manuscript.width);
				}

				if (manuscript.height) {
					manuscript.height = Number(manuscript.height);
				}

				if (manuscript.lastModified) {
					manuscript.lastModified = new Date(manuscript.lastModified);
				}

				if (manuscript.id) {
					manuscript.id = Number(manuscript.id);
				}

				return manuscript;
			}
		);

		let latestId = 0;
		loadedManuscripts.sort((a, b) => a.id - b.id);
		if (loadedManuscripts.length > 0) {
			const latestManuscript = loadedManuscripts[loadedManuscripts.length - 1];
			latestId = latestManuscript.id;
		}

		set({ manuscripts: loadedManuscripts, loaded: true, latestManuscriptId: latestId, userId: userId });
	};

	const createManuscript = async (options, fileData) => {
		if (!areLoaded()) {
			console.warn('manuscripts store not yet ready for new manuscript creation');
			return;
		}

		const newId = getLatestId()+1;
		const imageId = `image-${newId}.jpg`;
		const response = await fetch(IMAGE_URL(getUserId(), imageId), { method: 'PUT', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('createimage', {userId: getUserId(), imageId, id: newId, width: options.width, height: options.height }),
			body: fileData
		});
		if (response.status !== 201) {
			console.error(`image file upload failed: ${response.status}`);
		} else {
			let lastModified = '';
			response.headers.forEach((val, key) => {
				if (key.toLowerCase() === "last-modified") {
					lastModified = val;
				}
			});
			let newManuscript = {
				imageUrl: IMAGE_URL(getUserId(), imageId),
				lastModified: new Date(lastModified),
				width: Number(options.width),
				height: Number(options.height),
				id: Number(newId)
			};

			update(lib => {
				lib.manuscripts = [...lib.manuscripts, newManuscript];
				lib.latestManuscriptId = newManuscript.id;
				return lib;
			});
		}
	};

	return { subscribe, set, update, areLoaded, getLatestId, getUserId, loadManuscripts, createManuscript };
};

export const manuscripts = createManuscriptsStore();