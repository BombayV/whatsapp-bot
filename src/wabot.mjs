import qrcode from "qrcode-terminal";
import wb from 'whatsapp-web.js';
const { Client, LocalAuth } = wb

export const StartWhatsappClient = async (logger) => {
    const client = new Client({
        authStrategy: new LocalAuth()
    });

    client.on('authenticated', (session) => {
        logger.success("Whatsapp Bot authenticated!")
    });

    client.on('auth_failure', () => {
        logger.error("Whatsapp Bot failed to authenticate.")
    });

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

    client.on('ready', () => {
        logger.success("Whatsapp Bot started!")
    });

    client.on('message', async message => {
        // Ignore if the message is from the bot itself or from a group
        if (message.id?.participant) return;

        // Custom message for marcelo
        if (message.from === '593978789942@c.us') {
            await message.reply("Agachate y conocelo")
        }
    });

    await client.initialize()
    return client;
}