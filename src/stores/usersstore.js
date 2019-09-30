import { getHeaders, createDocument } from './azureutility.js';
import { writable } from 'svelte/store';

export const STORAGE_ACCOUNT_ENDPOINT = "https://roopchoueditorapp.blob.core.windows.net";

const createUsersStore = () => {
	const { subscribe, set, update } = writable({
		users: [],
		loaded: false,
		latestUserId: 0
	});

	const getField = (key) => {
		let ans = undefined;
		update(s => { ans = s[key]; return s; });
		return ans;
	};

	const areLoaded = () => getField('loaded');
	const getLatestId = () => getField('latestUserId');

	const loadUsers = async () => {
		if (areLoaded()) { return; }

		const url = `${STORAGE_ACCOUNT_ENDPOINT}/?comp=list&prefix=user&include=metadata&maxresults=20`;
		const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache', headers: getHeaders('loadusers') });
		const responseText = await response.text();
		const loadedUsers = Array.prototype.map.call(
			createDocument(responseText).querySelectorAll('Containers > Container'),
			container => {
				let user = {
					id: container.querySelector('Name').textContent,
					lastModified: container.querySelector('Properties > Last-Modified').textContent,
					userName: container.querySelector('Metadata > name').textContent
				};
				user['container'] = `${STORAGE_ACCOUNT_ENDPOINT}/${user.id}`;
				return user;
			}
		);

		let latestUserId = 0;
		loadedUsers.sort((a, b) => Number(a.id.substr(5)) - Number(b.id.substr(5)));
		if (loadedUsers.length > 0) {
			const latestUser = loadedUsers[loadedUsers.length - 1];
			latestUserId = Number(latestUser.id.substr(5));
		}

		set({ users: loadedUsers, loaded: true, latestUserId: latestUserId });
	};

	const createUser = async (userName) => {
		if (!areLoaded()) {
			console.warn('users store not yet ready for new user creation');
			return;
		}

		const userId = `user-${getLatestId()+1}`;
		const url = `${STORAGE_ACCOUNT_ENDPOINT}/${userId}?restype=container`;
		const response = await fetch(url, { method: 'PUT', mode: 'cors', cache: 'no-cache',
			headers: getHeaders('createuser', {userName, userId})
		});
		if (response.status !== 201) {
			console.error(`user creation failed: ${response.status}`);
		} else {
			let lastModified = '';
			response.headers.forEach((val, key) => {
				if (key.toLowerCase() === "last-modified") {
					lastModified = val;
				}
			});
			const newUser = { id: userId, userName, lastModified };
			newUser['container'] = `${STORAGE_ACCOUNT_ENDPOINT}/${newUser.id}`;
			update(s => {
				s.users = [...s.users, newUser];
				s.latestUserId += 1;
				return s;
			});
		}
	};

	return { subscribe, set, update, areLoaded, getLatestId, loadUsers, createUser };
};

export const users = createUsersStore();
