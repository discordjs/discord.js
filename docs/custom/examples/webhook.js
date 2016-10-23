/*
  Send a message using a webhook
*/

// import the discord.js module
const Discord = require('discord.js');

// create a new webhook
const hook = new Discord.WebhookClient('webhook id', 'webhook token');

// send a message using the webhook
hook.sendMessage('I am now alive!');
