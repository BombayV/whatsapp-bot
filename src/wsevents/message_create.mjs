import wacommands from '../commands/index.mjs';
import wb from 'whatsapp-web.js';
const { MessageMedia } = wb;

export const message_create = async (message, client) => {
	if (!message.fromMe) return;
	if (!message.body.includes('-')) return;

	const bodyData = message.body.split('-');
	if (bodyData && bodyData[0]) {
		if (wacommands[bodyData[0]]) {
			const args = bodyData.slice(1);
			wacommands[bodyData[0]](args, message, client.wabot, MessageMedia);
		}
	}
};
