import { getHeaders, LOAD_MANUSCRIPTS_URL, createDocument, FILE_URL } from './azureutility.js';
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
					imageUrl: FILE_URL(userId, blob.querySelector('Name').textContent),
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

				manuscript['rectanglesUrl'] = FILE_URL(userId, `rectangles-${manuscript.id}.csv`);
				manuscript['linesUrl'] = FILE_URL(userId, `lines-${manuscript.id}.csv`);

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

		// first upload rectangles file
		const rectsFileName = `rectangles-${newId}.csv`;
		const rectsUploadResponse = await fetch(FILE_URL(getUserId(), rectsFileName), { method: 'PUT', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('uploadtext', {userId: getUserId(), fileName: rectsFileName }),
			body: options.rectsFile
		});
		if (rectsUploadResponse.status !== 201) {
			console.error(`rectangles file upload failed: ${rectsUploadResponse.status}`);
			return;
		}

		// next upload lines file
		const linesFileName = `lines-${newId}.csv`;
		const linesUploadResponse = await fetch(FILE_URL(getUserId(), linesFileName), { method: 'PUT', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('uploadtext', {userId: getUserId(), fileName: linesFileName }),
			body: options.linesFile
		});
		if (linesUploadResponse.status !== 201) {
			console.error(`lines file upload failed: ${linesUploadResponse.status}`);
			return;
		}

		// finally upload image file
		const imageName = `image-${newId}.jpg`;
		const imgUploadResponse = await fetch(FILE_URL(getUserId(), imageName), { method: 'PUT', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('createimage', {userId: getUserId(), fileName: imageName, id: newId, width: options.width, height: options.height }),
			body: options.imageFile
		});
		if (imgUploadResponse.status !== 201) {
			console.error(`image file upload failed: ${imgUploadResponse.status}`);
			return;
		}

		// update in-memory structures
		let lastModified = '';
		imgUploadResponse.headers.forEach((val, key) => {
			if (key.toLowerCase() === "last-modified") {
				lastModified = val;
			}
		});
		let newManuscript = {
			imageUrl: FILE_URL(getUserId(), imageName),
			rectanglesUrl: FILE_URL(getUserId(), rectsFileName),
			linesUrl: FILE_URL(getUserId(), linesFileName),
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
	};

	return { subscribe, set, update, areLoaded, getLatestId, getUserId, loadManuscripts, createManuscript };
};

export const manuscripts = createManuscriptsStore();
