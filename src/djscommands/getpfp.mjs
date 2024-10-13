let chats = [];

export const getpfp = {
	name: 'getpfp',
	description: 'Get the profile picture url of a person.',
	options: [
		{
			name: 'person',
			description: 'The person to send the message to.',
			required: true,
			type: 3,
			autocomplete: true
		}
	],
	autocomplete: async (interaction) => {
		const { client } = interaction;
		const { wabot } = client;
		if (chats.length === 0) {
			chats = await wabot.getContacts();
		}
		const focusedValue = interaction.options.getFocused();
		const choices = chats.map((chat) => {
			if (chat && chat.name && chat.id._serialized) {
				return {
					name: chat.name,
					value: chat.id._serialized
				};
			}
		});
		// Return filtered responses up to 24 in length
		await interaction.respond(
			choices
				.filter((choice) => {
					if (choice && choice.name) {
						return choice.name.toLowerCase().includes(focusedValue.toLowerCase());
					}
				})
				.slice(0, 24)
		);
	},
	run: async (interaction) => {
		const { client } = interaction;
		const user = interaction.options.getString('person');
		const pfp = await client.wabot.getProfilePicUrl(user);
		if (pfp) {
			await interaction.editReply(pfp);
		} else {
			await interaction.editReply(`*${user}* no tiene foto.`);
		}
	}
};
