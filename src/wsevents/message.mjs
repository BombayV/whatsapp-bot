import {UnixToTime} from "../utils/UnixToTime.mjs";
import {AttachmentBuilder} from "discord.js";
import * as fs from "node:fs";

const vcardFile = async (vcardText) => {
  const writeStream = fs.openSync('./temp.vcf', 'w');
  fs.writeSync(writeStream, vcardText);
  fs.closeSync(writeStream);

  let attachment = new Promise((resolve, reject) => {
    fs.readFile('./temp.vcf', (err, data) => {
      if (err) return reject(err);
      attachment = new AttachmentBuilder(data, {
        name: 'contact.vcf',
        description: 'Contact',
      });

      resolve(attachment);
    });
  });

  const unlink = new Promise((resolve, reject) => {
    fs.unlink('./temp.vcf', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  await unlink;

  return await attachment;
}

export const message = async (message, client) => {
  const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
  if (!logsChannel) return;

  const contact = await message.getContact();
  const chat = await message.getChat();
  const name = `[${contact?.name || contact.pushname}]`;
  const time = `[${UnixToTime(message.timestamp)}]`;
  const chatIntro = chat.isGroup ? `${time} [${chat.name}] ${name}` : `${time} ${name}`;

  if (message.type === 'call_log') {
    return await logsChannel.send(`${chatIntro} [CALL_LOG] - **${message.body || 'Missed Call'}**`);
  }

  if (message.type === 'vcard' || message.type === 'multi_vcard') {
    for (const vcard of message.vCards) {
      const attachment = await vcardFile(vcard);
      await logsChannel.send({ content: `${chatIntro} - **Contact**`, files: [attachment] });
    }

    return;
  }

  let sendMsg, sendMedia;

  if (message.body) {
    if (message.body.length > 2000) {
      const messageChunks = message.body.match(/.{1,2000}/g);
      for (const chunk of messageChunks) {
        await logsChannel.send(`${chatIntro} - **${chunk}**`);
      }
    }

    sendMsg = `${chatIntro} - **${message.body}**`;
  }

  if (message.hasMedia) {
    const media = await message.downloadMedia();
    const data = media.data;
    const sfbuff = new Buffer.from(data, 'base64');
    const filetype = media.mimetype.split('/')[1];
    sendMedia = new AttachmentBuilder(sfbuff, {
      name: `${message.id}.${filetype}`,
      description: 'Media',
    });
  }

  if (sendMedia && sendMsg) return await logsChannel.send({ content: sendMsg, files: [sendMedia] });
  if (sendMedia && !sendMsg) return await logsChannel.send({ content: `${chatIntro} - **Media**`, files: [sendMedia] });
  if (sendMsg && !sendMedia) return await logsChannel.send(sendMsg);

  return await logsChannel.send(`${chatIntro} - **Unknown Message**`);
}