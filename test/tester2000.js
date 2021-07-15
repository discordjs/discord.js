'use strict';

const { token, prefix, owner } = require('./auth.js');
const { Client, Options, Intents, Formatters } = require('../src');

// eslint-disable-next-line no-console
const log = (...args) => console.log(process.uptime().toFixed(3), ...args);

const client = new Client({
  // 😏
  intents: Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0),
  makeCache: Options.cacheWithLimits({
    MessageManager: 10,
    PresenceManager: 10,
  }),
});

client.on('debug', log);
client.on('ready', () => {
  log('READY', client.user.tag, client.user.id);
});
client.on('rateLimit', log);
client.on('error', console.error);

const commands = {
  eval: message => {
    if (message.author.id !== owner) return;
    let res;
    try {
      res = eval(message.content);
      if (typeof res !== 'string') res = require('util').inspect(res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      res = err.message;
    }
    message.channel.send(Formatters.codeBlock(res));
  },
  ping: message => message.channel.send('pong'),
};

client.on('message', message => {
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
