import { StartWhatsappClient } from './wabot.mjs'
import { StartDJSClient } from "./djsbot.mjs";
import { Logger } from "./utils/Logger.mjs";

const logger = new Logger(true)

await StartDJSClient(logger, await StartWhatsappClient(logger))