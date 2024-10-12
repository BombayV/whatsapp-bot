export const status = async (data, message, client) => {
    const newStatus = data[1];
    await client.setStatus(newStatus);
    await message.reply('Status updated to: ```' + newStatus + '```');
}