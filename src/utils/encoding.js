export function base64Decode(str) {
	const bytes = new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
	return new TextDecoder('utf-8').decode(bytes);
}

export function isValidBase64(str) {
	const cleanStr = str.replace(/\s/g, '');
	return /^[A-Za-z0-9+/=]+$/.test(cleanStr);
}

export async function MD5MD5(text) {
	const encoder = new TextEncoder();
	const firstPass = await crypto.subtle.digest('MD5', encoder.encode(text));
	const firstHex = Array.from(new Uint8Array(firstPass))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
	const secondPass = await crypto.subtle.digest('MD5', encoder.encode(firstHex.slice(7, 27)));
	const secondHex = Array.from(new Uint8Array(secondPass))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
	return secondHex.toLowerCase();
}
