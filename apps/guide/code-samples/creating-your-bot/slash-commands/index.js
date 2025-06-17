const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
