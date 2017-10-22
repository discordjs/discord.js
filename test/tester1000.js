const Discord = require('../src');
const { token, prefix, owner } = require('./auth.js');

// eslint-disable-next-line no-console
const log = (...args) => console.log(process.uptime().toFixed(3), ...args);

const client = new Discord.Client();

client.on('debug', log);
client.on('ready', () => {
  log('READY', client.user.tag, client.user.id);
});

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
    message.channel.send(res, { code: 'js' });
  },
  ping: message => message.reply('pong'),
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
