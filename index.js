<> index.js
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = process.env.DISCORD_BOT_TOKEN || 'MTM5Mzg0NDEzMDYyMjQ3MjM4NQ.G8uzMI.F7wpqVE1OUABnrBYmwV93HshAu7tUdzIyjygdw';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === '!chat(content)') {
    message.channel.send('content!');
  }
});

client.login(TOKEN);
node index.js
