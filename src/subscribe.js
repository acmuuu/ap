import { ADD } from './utils/add.js';
import { base64Decode, isValidBase64 } from './utils/encoding.js';

export async function getSUB(api, request, 追加UA, userAgentHeader) {
	if (!api || api.length === 0) {
		return [];
	}
	api = [...new Set(api)];
	let newapi = '';
	let 订阅转换URLs = '';
	let 异常订阅 = '';
	const controller = new AbortController();
	const timeout = setTimeout(() => {
		controller.abort();
	}, 2000);

	try {
		const responses = await Promise.allSettled(
			api.map(apiUrl =>
				getUrl(request, apiUrl, 追加UA, userAgentHeader).then(response =>
					response.ok ? response.text() : Promise.reject(response)
				)
			)
		);

		const modifiedResponses = responses.map((response, index) => {
			if (response.status === 'rejected') {
				const reason = response.reason;
				if (reason && reason.name === 'AbortError') {
					return { status: '超时', value: null, apiUrl: api[index] };
				}
				console.error(`请求失败: ${api[index]}, 错误信息: ${reason.status} ${reason.statusText}`);
				return { status: '请求失败', value: null, apiUrl: api[index] };
			}
			return { status: response.status, value: response.value, apiUrl: api[index] };
		});

		console.log(modifiedResponses);

		for (const response of modifiedResponses) {
			if (response.status === 'fulfilled') {
				const content = (await response.value) || 'null';
				if (content.includes('proxies:')) {
					订阅转换URLs += '|' + response.apiUrl;
				} else if (content.includes('outbounds"') && content.includes('inbounds"')) {
					订阅转换URLs += '|' + response.apiUrl;
				} else if (content.includes('://')) {
					newapi += content + '\n';
				} else if (isValidBase64(content)) {
					newapi += base64Decode(content) + '\n';
				} else {
					const 异常订阅LINK = `trojan://CMLiussss@127.0.0.1:8888?security=tls&allowInsecure=1&type=tcp&headerType=none#%E5%BC%82%E5%B8%B8%E8%AE%A2%E9%98%85%20${response.apiUrl.split('://')[1].split('/')[0]}`;
					console.log('异常订阅: ' + 异常订阅LINK);
					异常订阅 += `${异常订阅LINK}\n`;
				}
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		clearTimeout(timeout);
	}

	const 订阅内容 = await ADD(newapi + 异常订阅);
	return [订阅内容, 订阅转换URLs];
}

export async function getUrl(request, targetUrl, 追加UA, userAgentHeader) {
	const newHeaders = new Headers(request.headers);
	newHeaders.set(
		'User-Agent',
		`${atob('djJyYXlOLzYuNDU=')} cmliu/CF-Workers-SUB ${追加UA}(${userAgentHeader})`
	);
	const modifiedRequest = new Request(targetUrl, {
		method: request.method,
		headers: newHeaders,
		body: request.method === 'GET' ? null : request.body,
		redirect: 'follow',
		cf: {
			insecureSkipVerify: true,
			allowUntrusted: true,
			validateCertificate: false,
		},
	});
	console.log(`请求URL: ${targetUrl}`);
	console.log(`请求头: ${JSON.stringify([...newHeaders])}`);
	console.log(`请求方法: ${request.method}`);
	console.log(`请求体: ${request.method === 'GET' ? null : request.body}`);
	return fetch(modifiedRequest);
}
