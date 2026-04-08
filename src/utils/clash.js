export function clashFix(content) {
	if (content.includes('wireguard') && !content.includes('remote-dns-resolve')) {
		const lines = content.includes('\r\n') ? content.split('\r\n') : content.split('\n');
		let result = '';
		for (const line of lines) {
			if (line.includes('type: wireguard')) {
				const 备改内容 = `, mtu: 1280, udp: true`;
				const 正确内容 = `, mtu: 1280, remote-dns-resolve: true, udp: true`;
				result += line.replace(new RegExp(备改内容, 'g'), 正确内容) + '\n';
			} else {
				result += line + '\n';
			}
		}
		content = result;
	}
	return content;
}
