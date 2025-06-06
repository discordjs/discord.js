'use strict';

const process = require('node:process');
const { GatewayIntentBits } = require('discord-api-types/v10');
const { token, prefix, owner } = require('./auth.js');
const { Client, Events, RESTEvents } = require('../src/index.js');

// eslint-disable-next-line no-console
const log = (...args) => console.log(process.uptime().toFixed(3), ...args);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  shardCount: 2,
});

client.on(Events.Debug, log);
client.on(Events.ClientReady, () => {
  log('READY', client.user.tag, client.user.id);
});
client.rest.on(RESTEvents.RateLimited, log);
client.on(Events.Error, console.error);

const commands = {
  eval: message => {
    if (message.author.id !== owner) return;
    let res;
    try {
      res = eval(message.content);
      if (typeof res !== 'string') res = require('node:util').inspect(res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      res = err.message;
    }
    message.channel.send(res, { code: 'js' });
  },
  ping: message => message.channel.send('pong'),
};

client.on(Events.MessageCreate, message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  message.content = message.content.replace(prefix, '').trim().split(' ');
  const command = message.content.shift();
  message.content = message.content.join(' ');

  // eslint-disable-next-line no-console
  console.log('COMMAND', command, message.content);

  if (command in commands) commands[command](message);
});

client.login(token);

// eslint-disable-next-line no-console
process.on('unhandledRejection', console.error);
