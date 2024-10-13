import { RefreshCommands } from '../utils/RefreshCommands.mjs';

export const refreshcommands = {
	name: 'refreshcommands',
	description: 'Refresh new commands.',
	run: async (interaction) => {
		try {
			await RefreshCommands();
			await interaction.editReply('**Successfully refreshed slash commands!**');
		} catch (error) {
			await interaction.editReply(`**Error:** *${error}*`);
		}
	}
};
