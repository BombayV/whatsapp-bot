let chats = []

export const sendmessage = {
    name: 'sendmessage',
    description: 'Send a message to a person.',
    options: [
        {
            name: 'person',
            description: 'The person to send the message to.',
            required: true,
            type: 3,
            autocomplete: true
        },
        {
            name: 'message',
            description: 'The message to send.',
            required: true,
            type: 3
        }
    ],
    autocomplete: async (interaction) => {
        const { client } = interaction;
        const { wabot } = client;
        if (chats.length === 0) {
            chats = await wabot.getChats()
        }
        const focusedValue = interaction.options.getFocused();
        const choices = chats.map(chat => {
            if (chat.name && chat.id._serialized) {
                return {
                    name: chat.name,
                    value: chat.id._serialized
                }
            }
        })
        // Return filtered responses up to 24 in length
        await interaction.respond(choices.filter(choice => choice.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 24))
    },
    run: async (interaction) => {
        const { client } = interaction;
        const message = interaction.options.getString('message');
        const user = interaction.options.getString('person');
        await client.wabot.sendMessage(user, message);
        await interaction.editReply(`**Successfully sent message to ${user}!**`);
    }
}