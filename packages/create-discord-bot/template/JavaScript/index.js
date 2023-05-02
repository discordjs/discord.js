import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}.`);
});

void client.login();
