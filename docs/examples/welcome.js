/*
  A bot that welcomes new guild members when they join
*/

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client
const client = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = 'your bot token here';

// the ID of the channel in which the bot will greet new users
const channel_id = 'your channel ID here';

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
client.on('ready', () => {
  console.log('I am ready!');
});

// create an event listener for new guild members
client.on('guildMemberAdd', (member) => {
  // get the channel
  var channel = client.channels.get(channel_id);

  // send the message, mentioning the member
  channel.sendMessage(`Welcome to the server, ${member}`);
});

// log our bot in
client.login(token);
