/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client
const client = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = 'your bot token here';

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
client.on('ready', () => {
  console.log('I am ready!');
});

// create an event listener for messages
client.on('message', message => {
  // if the message is "ping",
  if (message.content === 'ping') {
    // send "pong" to the same channel.
    message.channel.sendMessage('pong');
  }
});

// log our bot in
client.login(token);
