import { Logger } from '../utils/logger.mjs';
import {AttachmentBuilder} from "discord.js";

const logger = new Logger(true);
export const ready = async (client) => {
	logger.success(`Discord Bot started!`);

	client.user.setActivity('Whatsapp', { type: 3 });
	client.user.setStatus('invisible');

	const channel = client.channels.cache.get(process.env.LOG_CHANNEL);
	if (!channel) {
		logger.error('Could not find the log channel.');
		return;
	}

	const qrImage = client.qrCode;
	if (!qrImage) {
		channel.send('**Authentication passed. Whatsapp bot is ready.**');
		return;
	}

	const sfbuff = Buffer.from(qrImage.split(',')[1], 'base64');
	const attachment = new AttachmentBuilder(sfbuff, {
		name: 'qr.png',
		description: 'QR Code for Whatsapp login'
	});

	channel.send({ content: 'Scan the QR code to login to Whatsapp.', files: [attachment] });
};
