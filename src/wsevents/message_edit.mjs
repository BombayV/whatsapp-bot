import { UnixToTime } from '../utils/UnixToTime.mjs';

export const message_edit = async (message, newBody, prevBody, client) => {
	const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
	if (!logsChannel) return;
	if (newBody && prevBody) {
		const contact = await message.getContact();
		const chat = await message.getChat();
		const name = `[${contact?.name || contact.pushname}]`;
		const time = `[${UnixToTime(message.timestamp)}]`;
		const chatIntro = chat.isGroup ? `${time} [${chat.name}] ${name}` : `${time} ${name}`;

		await logsChannel.send(`${chatIntro} [EDITED_MESSAGE] - **${prevBody}** -> **${newBody}**`);
	}
};
