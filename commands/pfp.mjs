export const pfp = async (data, message, client, MessageMedia) => {
    const newPfpMedia = await MessageMedia.fromUrl(data[1]);
    await client.setProfilePicture(newPfpMedia);
    await message.reply('Profile picture updated!');
}