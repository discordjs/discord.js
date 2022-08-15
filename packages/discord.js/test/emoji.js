'use strict';

const { GatewayIntentBits } = require('discord-api-types/v10');
const { token } = require('./auth.js');
const { Client } = require('../src');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('ready');
});

client.on('messageCreate', message => {
  if (message.content === 'emoji-test') {
    message.guild.emojis.fetch('1008538563236872193').then(m => console.log(m.url('jpg')));
  }
});

client.login(token);
