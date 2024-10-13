export const logout = async (data, message, client) => {
	await message.reply('Logging out...');
	await client.logout();
};
