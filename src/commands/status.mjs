export const status = async (data, message, client) => {
	const newStatus = data[1];
	if (!newStatus) {
		await message.reply('Please provide a status to update to.');
		return;
	}

	await client.setStatus(newStatus);
	await message.reply('Status updated to: ```' + newStatus + '```');
};
