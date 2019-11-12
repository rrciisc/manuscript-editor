const masterKey = "fwLeaR0i6bQFTFGlSq4ifoMauLNaO9LgmG3Uup15rASKG1XW5DC82IQbNstLZwvUVBD2I77vNCZCgaDMMGFaiw==";

export const STORAGE_ACCOUNT_ENDPOINT = "https://manuscriptstore.blob.core.windows.net";
let domParser = undefined;

export const LOAD_USERS_URL = `${STORAGE_ACCOUNT_ENDPOINT}/?comp=list&prefix=user&include=metadata&maxresults=20`;
export const CREATE_USER_URL = (userId) => `${STORAGE_ACCOUNT_ENDPOINT}/${userId}?restype=container`;
export const LOAD_MANUSCRIPTS_URL = (userId) => `${STORAGE_ACCOUNT_ENDPOINT}/${userId}?restype=container&comp=list&prefix=image&include=metadata&maxresults=50`;
export const RECTANGLES_URL = (userId, imageId) => `${STORAGE_ACCOUNT_ENDPOINT}/${userId}/rectangles-${imageId}`;
export const LINES_BOTTOM_URL = (userId, imageId) => `${STORAGE_ACCOUNT_ENDPOINT}/${userId}/linesbottom-${imageId}`;
export const FILE_URL = (userId, fileName) => `${STORAGE_ACCOUNT_ENDPOINT}/${userId}/${fileName}`;

export const getHeaders = (operationName, options) => {
	const ContentMD5 = ''; let ContentType = ''; const xDate = '';
	const key = CryptoJS.enc.Base64.parse(masterKey);
	const headers = {
		'x-ms-date': new Date().toUTCString(),
		'x-ms-version': '2018-03-28'
	};

	let VERB = ''; let CanonicalizedHeaders = ''; let CanonicalizedResource = '/manuscriptstore/';
	switch(operationName) {
		case 'createuser':
			VERB = 'PUT';
			headers['x-ms-blob-public-access'] = 'blob';
			headers['x-ms-meta-name'] = options.userName;
			CanonicalizedHeaders = 'x-ms-blob-public-access:' + headers['x-ms-blob-public-access'] + "\n" +
														 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-meta-name:' + headers['x-ms-meta-name'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += options.userId;
			break;
		case 'createimage':
			VERB = 'PUT';
			ContentType = headers['Content-Type'] = 'image/jpeg';
			headers['x-ms-blob-type'] = 'BlockBlob';
			CanonicalizedHeaders = 'x-ms-blob-type:' + headers['x-ms-blob-type'] + "\n" +
														 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += `${options.userId}/${options.fileName}`;
			break;
		case 'uploadtext':
			VERB = 'PUT';
			ContentType = headers['Content-Type'] = 'text/plain';
			headers['x-ms-blob-type'] = 'BlockBlob';
			CanonicalizedHeaders = 'x-ms-blob-type:' + headers['x-ms-blob-type'] + "\n" +
														 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += `${options.userId}/${options.fileName}`;
			break;
		case 'uploadbook':
			VERB = 'PUT';
			ContentType = headers['Content-Type'] = 'application/pdf';
			headers['x-ms-blob-type'] = 'BlockBlob';
			CanonicalizedHeaders = 'x-ms-blob-type:' + headers['x-ms-blob-type'] + "\n" +
														 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += `${options.bookId}/pdf`;
			break;
		case 'loadusers':
			VERB = 'GET';
			CanonicalizedHeaders = 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += '?comp=list';
			break;
		case 'loadmanuscripts':
			VERB = 'GET';
			CanonicalizedHeaders = 'x-ms-date:' + headers['x-ms-date'] + "\n" +
														 'x-ms-version:' + headers['x-ms-version'];
			CanonicalizedResource += `${options.userId}?comp=list`;
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
	const authToken = "SharedKeyLite manuscriptstore:"+hashInBase64;
	headers['Authorization'] = authToken;
	return headers;
};

export const createDocument = (text) => {
	domParser = domParser || new DOMParser();
	return domParser.parseFromString(text, 'application/xml');
};
