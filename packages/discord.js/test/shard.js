'use strict';

const process = require('node:process');
const { setTimeout } = require('node:timers');
const { GatewayIntentBits } = require('discord-api-types/v10');
const { token } = require('./auth.json');
const { Client } = require('../src');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  shards: process.argv[2],
  shardCount: process.argv[3],
});

client.on('messageCreate', msg => {
  if (msg.content.startsWith('?eval') && msg.author.id === '66564597481480192') {
    try {
      const com = eval(msg.content.split(' ').slice(1).join(' '));
      msg.channel.send(com, { code: true });
    } catch (e) {
      msg.channel.send(e, { code: true });
    }
  }
});

process.send(123);

client.on('ready', () => {
  console.log('Ready', client.options.shards);
  if (client.options.shards === 0) {
    setTimeout(() => {
      console.log('kek dying');
      client.destroy();
    }, 5_000);
  }
});

client.login(token).catch(console.error);
