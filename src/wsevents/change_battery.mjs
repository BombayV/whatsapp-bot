export const change_battery = async (batteryInfo, client) => {
	const logsChannel = client.channels.cache.get(process.env.LOG_CHANNEL);
	if (!logsChannel) return;
	if (batteryInfo.plugged) {
		await logsChannel.send(`Charging phone. Battery at ${batteryInfo.battery}.`);
	} else {
		await logsChannel.send(`Phone is not charging. Battery at ${batteryInfo.battery}.`);
	}
};
