import QRCode from 'qrcode'
import wb from 'whatsapp-web.js';
const { Client, LocalAuth } = wb;

const generateQR = async text => {
	try {
		return await QRCode.toDataURL(text);
	} catch (err) {
		console.error(err)
		return null;
	}
}

export const StartWhatsappClient = async (logger) => {
	const client = new Client({
		authStrategy: new LocalAuth()
	});

	const qrPromise = new Promise((resolve, reject) => {
		client.on('qr', async qr => {
			resolve(await generateQR(qr));
		});

		client.on('authenticated', () => {
			logger.success('Whatsapp Bot authenticated!');
		});

		client.on('auth_failure', () => {
			logger.error('Whatsapp Bot failed to authenticate.');
			reject();
		});

		client.on('ready', () => {
			logger.success('Whatsapp Bot started!');
			resolve();
		});
	});

	await client.initialize();
	return {
		wabot: client,
		qrPromise
	}
};
