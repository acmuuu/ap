import { ADD } from './utils/add.js';

export async function proxyURL(proxyURL, url) {
	const URLs = await ADD(proxyURL);
	const fullURL = URLs[Math.floor(Math.random() * URLs.length)];
	const parsedURL = new URL(fullURL);
	console.log(parsedURL);
	let URLProtocol = parsedURL.protocol.slice(0, -1) || 'https';
	let URLHostname = parsedURL.hostname;
	let URLPathname = parsedURL.pathname;
	let URLSearch = parsedURL.search;
	if (URLPathname.charAt(URLPathname.length - 1) == '/') {
		URLPathname = URLPathname.slice(0, -1);
	}
	URLPathname += url.pathname;
	const newURL = `${URLProtocol}://${URLHostname}${URLPathname}${URLSearch}`;
	const response = await fetch(newURL);
	const newResponse = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	});
	newResponse.headers.set('X-New-URL', newURL);
	return newResponse;
}
