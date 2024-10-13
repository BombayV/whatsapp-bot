import {UnixToTime} from "../utils/UnixToTime.mjs";

export const message_revoke_everyone = async (message, revokeMessage, client) => {
  const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
  if (!logsChannel || !revokeMessage) return;

  const contact = await message.getContact();
  const chat = await message.getChat();
  const name = `[${contact?.name || contact.pushname}]`;
  const time = `[${UnixToTime(message.timestamp)}]`;
  const chatIntro = chat.isGroup ? `${time} [${chat.name}] ${name}` : `${time} ${name}`;

  await logsChannel.send(`${chatIntro} [REMOVED_MESSAGE] - **${revokeMessage.body}**`);
}
