/* eslint no-console: 0 */
'use strict';

const ytdl = require('ytdl-core');
const auth = require('./auth.js');
const Discord = require('../src');

const client = new Discord.Client({ fetchAllMembers: false, partials: [] });

client
  .login(auth.token)
  .then(() => console.log('logged'))
  .catch(console.error);

const connections = new Map();

client.on('debug', console.log);
client.on('error', console.log);

process.on('unhandledRejection', console.log);

client.on('presenceUpdate', (a, b) => {
  if (b.userID !== '66564597481480192') return;
  console.log(a ? a.status : null, b.status, b.user.username);
});

client.on('messageDelete', async m => {
  if (m.channel.id !== '80426989059575808') return;
  console.log(m.channel.recipient);
  console.log(m.channel.partial);
  await m.channel.fetch();
  console.log('\n\n\n\n');
  console.log(m.channel);
});

client.on('message', m => {
  if (!m.guild) return;
  if (m.author.id !== '66564597481480192') return;
  if (m.content.startsWith('/join')) {
    const channel = m.guild.channels.cache.get(m.content.split(' ')[1]) || m.member.voice.channel;
    if (channel && channel.type === 'voice') {
      channel.join().then(conn => {
        conn.receiver.createStream(m.author, true).on('data', b => console.log(b.toString()));
        conn.player.on('error', (...e) => console.log('player', ...e));
        if (!connections.has(m.guild.id)) connections.set(m.guild.id, { conn, queue: [] });
        m.channel.send('ok!');
        conn.play(ytdl('https://www.youtube.com/watch?v=_XXOSf0s2nk', { filter: 'audioonly' }, { passes: 3 }));
      });
    } else {
      m.channel.send('Specify a voice channel!');
    }
  } else if (m.content.startsWith('#eval') && m.author.id === '66564597481480192') {
    try {
      const com = eval(m.content.split(' ').slice(1).join(' '));
      m.channel.send(com, { code: true });
    } catch (e) {
      console.log(e);
      m.channel.send(e, { code: true });
    }
  }
});
