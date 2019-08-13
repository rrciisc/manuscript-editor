const masterKey = "Gg8iXkSPlLJQv6nKq5yrejRqWRDzCyifpu+YB+rhcQYZBDLkg5CuOBY3DoCktwaoCd6QeZT6DqD5Jfj3Y84eqA==";
let domParser = undefined;

export const getRequestHeaders = () => {
	const now = new Date().toUTCString();
	const xmsversion = '2018-03-28';

	const key = CryptoJS.enc.Base64.parse(masterKey);

	const VERB = 'GET';
	const ContentMD5 = '';
	const ContentType = '';
	const xDate = '';
	const CanonicalizedHeaders = 'x-ms-date:' + now + "\n" + 'x-ms-version:' + xmsversion;
	const CanonicalizedResource = '/roopchoueditorapp/?comp=list';

	const strToSign = VERB + "\n" +
										ContentMD5 + "\n" +
										ContentType + "\n" +
										xDate + "\n" +
										CanonicalizedHeaders + "\n" +
										CanonicalizedResource;

	const hash = CryptoJS.HmacSHA256(strToSign, key);
	const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
	const authToken = "SharedKeyLite roopchoueditorapp:"+hashInBase64;

	return {
		'x-ms-date': now,
		'x-ms-version': xmsversion,
		'Authorization': authToken
	};
};

export const createDocument = (text) => {
	domParser = domParser || new DOMParser();
	return domParser.parseFromString(text, 'application/xml');
};