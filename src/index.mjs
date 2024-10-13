import { StartWhatsappClient } from './wabot.mjs';
import { StartDJSClient } from './djsbot.mjs';
import { Logger } from './utils/Logger.mjs';

const logger = new Logger(true);

const ws = await StartWhatsappClient(logger);
const client = await StartDJSClient(logger, ws.wabot, ws.qrPromise);

const loggedIn = await client.login(process.env.TOKEN);
if (!loggedIn) {
	logger.error('Error logging in to Discord with the provided token.');
}
