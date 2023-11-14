import { Logger } from '../utils/logger.mjs';

const logger = new Logger(true);

export const interactionCreate = async (interaction) => {
    const { commandName } = interaction;

    const command = interaction.client.commands.get(commandName);
    if (!command) return
    const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
    if (!isAdmin) return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });

    if (interaction.isAutocomplete()) {
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
        }
    }

    if (!interaction.isCommand()) return;

    // Try to execute command
    try {
        await interaction.deferReply({ ephemeral: command.ephemeral || false, content: command.deferReply || null });
        await command.run(interaction);
    } catch(e) {
        logger.error(`Error executing command ${command.name}: ${e}`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}