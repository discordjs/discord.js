const Discord = require('discord.js');

const client = new Discord.RPCClient({
  transport: 'ipc',
});

client.on('ready', () => {
  console.log('Logged in as', client.application.name);
  console.log('Authed for user', client.user.tag);
});

client.login('my client id', { clientSecret: 'my client secret' });
