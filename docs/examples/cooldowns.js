/*
  A ping pong bot, whenever you send "ping", it replies "pong".
  However, you can only do it so quickly.
*/

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'your bot token here';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Cooldown User Object (Empty Array)
var cooldownUsers = [];

// Cooldown Check Function
const checkCooldown = ((userId) => {
  if(cooldownUsers.indexOf(userId) > -1) {
    return true;
  } else {
    return false;
  }
});

// Cooldown Removal Function
const removeCooldown = ((userId, timeInSeconds) => {
  let index = cooldownUsers.indexOf(userId);
  if(index > -1) { 
    setTimeout(() => {
      cooldownUsers = cooldownUsers.splice(index, 0);
    }, timeInSeconds * 1000)
  }
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "$ping" add cooldown to author id
  if (message.content === '$ping') {
    if(checkCooldown(message.author.id)) {
      message.channel.send("Sorry! Please wait to run this command again.");
      return;
    }
    cooldownUsers.push(message.author.id);
    // remove cooldown after 5 seconds
    removeCooldown(message.author.id, 5);
    message.channel.send('pong');
  }
});

// Log our bot in
client.login(token);
