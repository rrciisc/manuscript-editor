const masterKey = "Gg8iXkSPlLJQv6nKq5yrejRqWRDzCyifpu+YB+rhcQYZBDLkg5CuOBY3DoCktwaoCd6QeZT6DqD5Jfj3Y84eqA==";
let domParser = undefined;

export const getHeaders = (operationName, options) => {
	const ContentMD5 = ''; const ContentType = ''; const xDate = '';
	const key = CryptoJS.enc.Base64.parse(masterKey);
	const headers = {
		'x-ms-date': new Date().toUTCString(),
		'x-ms-version': '2018-03-28'
	};

	let VERB = ''; let CanonicalizedHeaders = ''; let CanonicalizedResource = '/roopchoueditorapp/';
	switch(operationName) {
		case 'createbook':
			VERB = 'PUT';
			headers['x-ms-blob-public-access'] = 'blob';
			headers['x-ms-meta-description'] = options.bookDescription;
			headers['x-ms-meta-name'] = options.bookName;
			CanonicalizedHeaders = 'x-ms-blob-public-access:' + headers['x-ms-blob-public-access'] + "\n" +
														 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-meta-description:' + headers['x-ms-meta-description'] + "\n" +
														 'x-ms-meta-name:' + headers['x-ms-meta-name'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += options.bookId;
			break;
		case 'loadbooks':
			VERB = 'GET';
			CanonicalizedHeaders = 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += '?comp=list';
			break;
		default:
			console.error(`unknown operation ${operationName}`);
			return;
	}

	const strToSign = VERB + "\n" +
										ContentMD5 + "\n" +
										ContentType + "\n" +
										xDate + "\n" +
										CanonicalizedHeaders + "\n" +
										CanonicalizedResource;

	const hash = CryptoJS.HmacSHA256(strToSign, key);
	const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
	const authToken = "SharedKeyLite roopchoueditorapp:"+hashInBase64;
	headers['Authorization'] = authToken;
	return headers;
};

export const createDocument = (text) => {
	domParser = domParser || new DOMParser();
	return domParser.parseFromString(text, 'application/xml');
};