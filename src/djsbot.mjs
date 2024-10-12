import dotenv from 'dotenv'
import djscommands from "./djscommands/index.mjs";
import djsevents from './events/index.mjs'
import wacommands from './commands.mjs'
import wb from 'whatsapp-web.js';
import { RefreshCommands } from "./utils/RefreshCommands.mjs";
import {Collection, IntentsBitField, Partials, Client, AttachmentBuilder} from "discord.js";
import {UnixToTime} from "./utils/UnixToTime.mjs";
const { MessageMedia } = wb


dotenv.config();

const intents = new IntentsBitField([
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildBans,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.MessageContent
]);
const partials = [Partials.Message, Partials.Channel, Partials.Reaction];
const commands = new Collection();
const events = new Collection();

export const StartDJSClient = (logger, wabot) => {
    const client = new Client({intents, partials});

    client.commands = commands;
    client.events = events;
    client.wabot = wabot;

    for (const event in djsevents) {
        client.on(event, djsevents[event]);
    }

    for (const command in djscommands) {
        client.commands.set(djscommands[command].name, djscommands[command]);
    }

    client.login(process.env.TOKEN).then(async () => {
        await RefreshCommands(); // Leave commented
    }).catch(() => {
        logger.error("Error logging in to Discord with the provided token.");
    });

    wabot.on('change_battery', async batteryInfo => {
        const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
        if (!logsChannel) return;
        if (batteryInfo.plugged) {
            await logsChannel.send(`Cargando telefono. Bateria ${batteryInfo.battery}.`)
        } else {
            await logsChannel.send(`Telefono desconectado. Bateria ${batteryInfo.battery}.`)
        }
    });

    wabot.on('contact_changed', async (message, oldId, newId, isContact) => {
        const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
        if (!logsChannel) return;
        if (message && message.body) {
            await logsChannel.send(`[${UnixToTime(message.timestamp)}] [Contact Changed] **${message.body}** - OldId: ${oldId} - NewId: ${newId} - Contact: ${isContact}`)
        } else {
            await logsChannel.send(`[${UnixToTime(message.timestamp)}] [Contact Changed] - OldId: ${oldId} - NewId: ${newId} - Contact: ${isContact}`)
        }
    });

    wabot.on('call', async (call) => {
        const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
        if (!logsChannel) return;
        if (call.outgoing) {
            await logsChannel.send(`[${UnixToTime(call.timestamp)}] Dante esta haciendo una ${call.isVideo ? "videollamada" : "llamada"}.`)
        } else {
            await logsChannel.send(`[${UnixToTime(call.timestamp)}] Dante esta recibiendo una ${call.isVideo ? "videollamada" : "llamada"} de ${call.from}.`)
        }
    });

    wabot.on('message_edit', async (message, newBody, prevBody) => {
        const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
        if (!logsChannel) return;
        if (newBody && prevBody) {
            const contact = await message.getContact()
            const name = contact.pushname
            await logsChannel.send(`[${UnixToTime(message.timestamp)}] [${name}] [Edited Message] New: ${newBody} - Old: ${prevBody}.`)
        }
    })

    // Whatsapp Event Handler
    wabot.on('message_create', async message => {
        if (!message.fromMe) {
            const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
            if (!logsChannel) return;

            const contact = await message.getContact()
            const name = contact.pushname
            if (message.body) {
                if(message.body.length > 1000) return;
                
                const chat = await message.getChat();
                if (chat.isGroup){
                    await logsChannel.send(`[${UnixToTime(message.timestamp)}] [${chat.groupMetadata.subject || "Grupo"}] [${name}] **${message.body}**`)
                } else {
                    await logsChannel.send(`[${UnixToTime(message.timestamp)}] [${name}] **${message.body}**`)
                }
            }

            if (message.hasMedia) {
                const media = await message.downloadMedia();
                const data = media.data;
                const sfbuff = new Buffer.from(data, "base64");
                const filetype = media.mimetype.split('/')[1]
                const sfattach = new AttachmentBuilder(sfbuff, `output.${filetype}`);
                await logsChannel.send({files: [sfattach], content: `[${name}]`});
            }
        } else {
            if (!message.body.includes('-')) return;

            const bodyData = message.body.split('-')
            if (bodyData && bodyData[0]) {
                if (wacommands[bodyData[0]]) {
                    wacommands[bodyData[0]](bodyData, message, wabot, MessageMedia)
                }
            }
        }
    })
}