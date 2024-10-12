import { REST, Routes } from 'discord.js';
import { Logger } from "./Logger.mjs";
import dotenv from 'dotenv';
import djscommands from '../djscommands/index.mjs';
dotenv.config();

let firstRun = true;
const logger = new Logger(true);
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

export const RefreshCommands = async () => {
    const commands = [];
    for (const command in djscommands) {
        const cmd = djscommands[command];
        commands.push({
            name: cmd.name,
            description: cmd.description,
            options: cmd.options
        });
    }

    try {
        if (firstRun) {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            firstRun = false;
            logger.success('Successfully reloaded application (/) commands.');
        } else {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
            logger.success('Commands refreshed manually.');
        }
    } catch (error) {
        logger.error(error);
    }
}