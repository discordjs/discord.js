'use strict';

const { token } = require('./auth.json');
const Discord = require('../src');

const client = new Discord.Client({
  shards: process.argv[2],
  shardCount: process.argv[3],
});

client.on('message', msg => {
  if (msg.content.startsWith('?eval') && msg.author.id === '66564597481480192') {
    try {
      const com = eval(
        msg.content
          .split(' ')
          .slice(1)
          .join(' '),
      );
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
    }, 5000);
  }
});

client.login(token).catch(console.error);
