export const pfp = async (data, message, client, MessageMedia) => {
	if (!data[1]) {
		await message.reply('Please provide a URL to the new profile picture.');
		return;
	}

	const newPfpMedia = await MessageMedia.fromUrl(data[1]);
	await client.setProfilePicture(newPfpMedia);
	await message.reply('Profile picture updated!');
};
