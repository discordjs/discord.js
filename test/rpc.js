/* eslint-disable no-console */

const Discord = require('../src');

const client = new Discord.RPCClient({
  transport: 'websocket',
});

client.on('ready', () => {
  console.log('Logged in as', client.application.name);
  console.log('Authed for user', client.user.tag);
  client.getGuilds().then(console.log).catch(console.error);
});

// StreamKit client id (don't be mad jake)
client.login('207646673902501888', {
  scopes: ['rpc', 'rpc.api', 'messages.read'],
  tokenEndpoint: 'https://streamkit.discordapp.com/overlay/token',
  // Origin is only needed for certain applications when using the `websocket` transport
  origin: 'https://streamkit.discordapp.com',
});
