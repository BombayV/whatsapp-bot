export const test = async (args, message) => {
	const params = args.join(' ');
	const chat = await message.getChat();
	await chat.sendMessage(`Test command with params: ${params}`);
};
