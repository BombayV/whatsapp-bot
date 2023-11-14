import { Logger } from '../utils/logger.mjs';

const logger = new Logger(true);
const LOG_CHANNEL = '1105730552151158865';
export const ready = async (client) => {
    logger.success(`Discord Bot started!`);

    const channel = client.channels.cache.get(LOG_CHANNEL);
    channel.send(`Buenas tardes mis estimados`);

    client.user.setActivity('Whatsapp', { type: 3 });
    client.user.setStatus('dnd');
};