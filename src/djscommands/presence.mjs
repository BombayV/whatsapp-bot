export const presence = {
    name: 'presence',
    description: 'Change your whatsapp status presence.',
    options: [
        {
            name: 'state',
            description: 'Available/Unavailable',
            required: true,
            type: 5
        }
    ], run: async (interaction) => {
        const { client } = interaction;
        const { wabot } = client;
        const statusVal = interaction.options.getBoolean('state')
        if (statusVal) {
            await wabot.sendPresenceAvailable()
        } else {
            await wabot.sendPresenceUnavailable()
        }

        await interaction.editReply(`**Successfully changed presence to ${statusVal}!**`);
    }
}