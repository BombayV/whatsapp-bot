import { UnixToTime } from '../utils/UnixToTime.mjs';

export const contact_change = async (message, oldId, newId, isContact, client) => {
	const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
	if (!logsChannel) return;

	if (message && isContact) {
		await logsChannel.send(`[${UnixToTime(message.timestamp)}] [Contact Changed] OldId: ${oldId} - NewId: ${newId}`);
	}
};
