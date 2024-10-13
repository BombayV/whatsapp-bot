import {UnixToTime} from "../utils/UnixToTime.mjs";

export const incoming_call = async (call, client) => {
  const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
  if (!logsChannel) return;

  const isVideo = call.isVideo ? 'videocall' : 'call';
  const isOutgoing = call.outgoing ? 'making' : 'receiving';
  const from = call.peerJid;
  const time = `[${UnixToTime(call.timestamp)}]`;
  const owner = client.wabot.info.pushname;

  await logsChannel.send(`${time} ${owner} is ${isOutgoing} a ${isVideo} from ${from}`);
}