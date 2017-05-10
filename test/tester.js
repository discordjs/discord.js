const Discord = require('../src');

const { token, owner } = require('./auth.js');

function log(...x) {
  // eslint-disable-next-line no-console
  return console.log(process.uptime().toFixed(3), ...x);
}

const client = new Discord.Client();

client.on('ready', () => {
  log('READY', client.user.tag, client.user.id);
});

client.on('message', message => {
  if (message.author.id === owner && message.content.startsWith('w!eval')) {
    let res;
    try {
      res = eval(message.content.replace('w!eval', '').trim());
    } catch (err) {
      res = err.message;
    }
    message.channel.send(res, { code: 'js' });
  }
});

client.on('debug', log);

client.login(token);

process.on('unhandledRejection', log);
