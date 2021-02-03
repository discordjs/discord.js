'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', async message => {
  // If the message is "ping"
  if (message.content === 'ping') {
    // Send the reply to the same channel.
    var m = await message.channel.send('Pinging...');
    var ping = m.createdTimestamp - message.createdTimestamp;
    m.edit(`${ping} ms.`);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('your token here');
