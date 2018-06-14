const Discord = require('../src');
const { token, prefix, owner } = require('./auth.js');

// eslint-disable-next-line no-console
const log = (...args) => console.log(process.uptime().toFixed(3), ...args);

const client = new Discord.Client({ apiRequestConcurrency: Infinity, restTimeOffset: 0 });

client.on('debug', log);
client.on('ready', () => {
  log('READY', client.user.tag, client.user.id);
});
client.on('rateLimit', info => log(`ratelimited for ${info.timeout} ms`));
client.on('error', log);

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
    if (res.length > 6000) {
      message.channel.send('response too long; check console');
      // eslint-disable-next-line no-console
      console.log(res);
    } else {
      message.channel.send(res, { code: 'js', split: true });
    }
  },
  ping: message => message.reply('pong'),
  spam: async message => {
    const start = Date.now();
    await Promise.all(Array.from({ length: 10 }, (_, i) => message.channel.send(`spam${i}`)));
    const diff = Date.now() - start;
    message.channel.send(`total time: \`${diff}ms\``);
  },
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
