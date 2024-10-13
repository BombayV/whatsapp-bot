import { Logger } from '../utils/logger.mjs';

const logger = new Logger(true);
export const error = async (error) => {
	logger.error(`Discord.js error: ${error}`);
};
