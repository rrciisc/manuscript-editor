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
				let w = blob.querySelector('Metadata > width');
				let h = blob.querySelector('Metadata > height');
				let m_id = blob.querySelector('Metadata > id');
				let manuscript = {
					imageUrl: FILE_URL(userId, blob.querySelector('Name').textContent),
					lastModified: blob.querySelector('Properties > Last-Modified').textContent,
					width: "0",
					height: "0",
					id: "-1"
				};

				if (w && w.textContent) {
					manuscript.width = Number(w.textContent);
				}

				if (h && h.textContent) {
					manuscript.height = Number(h.textContent);
				}

				if (manuscript.lastModified) {
					manuscript.lastModified = new Date(manuscript.lastModified);
				}

				if (m_id && m_id.textContent) {
					manuscript.id = Number(m_id.textContent);
					manuscript['rectanglesUrl'] = FILE_URL(userId, `rectangles-${manuscript.id}.csv`);
					manuscript['linesUrl'] = FILE_URL(userId, `lines-${manuscript.id}.csv`);
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

		const rectsFileName = `rectangles-${newId}.csv`;
		const linesFileName = `lines-${newId}.csv`;

		// finally upload image file
		const imageName = `image-${newId}.jpg`;
		const imgUploadResponse = await fetch(FILE_URL(getUserId(), imageName), { method: 'PUT', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('createimage', {userId: getUserId(), fileName: imageName}),
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
			lastModified: new Date(lastModified)//,
			// how will this get refreshed in memory?
			//width: Number(options.width),
			//height: Number(options.height),
			//id: Number(newId)
		};

		update(lib => {
			lib.manuscripts = [...lib.manuscripts, newManuscript];
			lib.latestManuscriptId = newManuscript.id;
			return lib;
		});
	};

	const getManuscriptById = (id) => {
		let manuscript = undefined;
		update(s => {
			s.manuscripts.forEach(m => {
				if (m.id === id) {
					manuscript = m;
				}
			});
			return s;
		});
		return manuscript;
	};

	return { subscribe, set, update, areLoaded, getLatestId, getUserId, loadManuscripts, createManuscript, getManuscriptById };
};

export const manuscripts = createManuscriptsStore();
