import dotenv from 'dotenv';
import djscommands from './djscommands/index.mjs';
import djsevents from './events/index.mjs';
import wb from 'whatsapp-web.js';
import { Collection, IntentsBitField, Partials, Client, AttachmentBuilder } from 'discord.js';
import {message_create} from "./wsevents/message_create.mjs";
import {message_edit} from "./wsevents/message_edit.mjs";
import {change_battery} from "./wsevents/change_battery.mjs";
import {message} from "./wsevents/message.mjs";
import {incoming_call} from "./wsevents/incoming_call.mjs";
import {message_ciphertext} from "./wsevents/message_ciphertext.mjs";
import {message_revoke_everyone} from "./wsevents/message_revoke_everyone.mjs";
import {loading_screen} from "./wsevents/loading_screen.mjs";
import {contact_change} from "./wsevents/contact_change.mjs";
import {media_uploaded} from "./wsevents/media_uploaded.mjs";

dotenv.config();

const intents = new IntentsBitField([
	'Guilds',
	'GuildMembers',
	'GuildMessages',
	'GuildMessageReactions',
	'GuildModeration',
	'GuildPresences',
	'GuildInvites',
	'DirectMessages',
	'DirectMessageReactions',
	'MessageContent'
]);
const commands = new Collection();
const events = new Collection();

export const StartDJSClient = async (logger, wabot, qrPromise) => {
	const client = new Client({ intents });
	client.commands = commands;
	client.events = events;
	client.wabot = wabot;
	client.qrCode = await qrPromise;

	for (const event in djsevents) {
		client.on(event, djsevents[event]);
	}

	for (const command in djscommands) {
		client.commands.set(djscommands[command].name, djscommands[command]);
	}

	wabot.on('media_uploaded', async (msg) => await media_uploaded(msg, client));
	wabot.on('contact_changed', async (msg, oldId, newId, isContact) => await contact_change(msg, oldId, newId, isContact, client));
	wabot.on('change_battery', async (batteryInfo) => await change_battery(batteryInfo, client));
	wabot.on('incoming_call', async (callData) => await call(callData, client));
	wabot.on('message', async (msg) => await message(msg, client));
	wabot.on('message_edit', async (msg, newBody, prevBody) => await message_edit(msg, newBody, prevBody, client));
	wabot.on('message_create', async (msg) => await message_create(msg, client));
	wabot.on('message_ciphertext', async (msg) => await message_ciphertext(msg, client));
	wabot.on('message_revoke_everyone', async (msg, revoked) => await message_revoke_everyone(msg, revoked, client));
	wabot.on('loading_screen', async (percent, msg) => await loading_screen(percent, msg, client));

	return client;
};
