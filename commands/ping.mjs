export const ping = async (data, message) => {
    const chat = await message.getChat()
    await chat.sendMessage('Pong!')
}