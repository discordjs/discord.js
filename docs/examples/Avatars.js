/*
  Send a user a link to their avatar
*/

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = 'your bot token here';

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
  console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', message => {
  // if the message is "what is my avatar",
  if (message.content === 'what is my avatar') {
    // send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
});

// log our bot in
bot.login(token);
