const Discord = require('../');
const { token } = require('./auth.json');

const client = new Discord.Client({
  shard_id: process.argv[2],
  shard_count: process.argv[3],
});

client.on('message', msg => {
  if (msg.content.startsWith('?eval') && msg.author.id === '66564597481480192') {
    try {
      const com = eval(msg.content.split(' ').slice(1).join(' '));
      msg.channel.sendMessage('```\n' + com + '```');
    } catch (e) {
      msg.channel.sendMessage('```\n' + e + '```');
    }
  }
});

process.send(123);

client.on('ready', () => {
  console.log('Ready');
});

client.login(token).catch(console.log);
