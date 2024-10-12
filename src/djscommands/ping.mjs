export const ping = {
    name: 'ping',
    description: 'Get the current bot latency.',
    run: async (interaction) => {
        const { client } = interaction;

        const reply = await interaction.editReply("Ping?");
        const message = `
    **WS Ping:** ${client.ws.ping}ms\n**API Ping:** ${reply.createdTimestamp - interaction.createdTimestamp}ms
    `
        await interaction.editReply(message);
    }
}