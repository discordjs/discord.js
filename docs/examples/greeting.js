'use strict';

/**
 * A bot that welcomes new guild members when they join
 */

// Import the discord.js module
const { Client, Intents } = require('discord.js');

// Create an instance of a Discord client
// Note: you __MUST__ have the GUILD_MEMBERS intent toggled on the dashboard
// see https://discordjs.guide/popular-topics/intents.html for more
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('your token here');
