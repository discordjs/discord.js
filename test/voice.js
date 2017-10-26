/* eslint no-console: 0 */
'use strict';

const Discord = require('../');
const ytdl = require('ytdl-core');
const prism = require('prism-media');
const fs = require('fs');

const client = new Discord.Client({ fetchAllMembers: false, apiRequestMethod: 'sequential' });

const auth = require('./auth.js');

client.login(auth.token).then(() => console.log('logged')).catch(console.error);

const connections = new Map();

var d;

client.on('debug', console.log);
client.on('error', console.log);

client.on('message', m => {
  if (!m.guild) return;
  if (m.author.id !== '66564597481480192') return;
  if (m.content.startsWith('/join')) {
    const channel = m.guild.channels.get(m.content.split(' ')[1]) || m.member.voiceChannel;
    if (channel && channel.type === 'voice') {
      channel.join().then(conn => {
        conn.player.on('error', (...e) => console.log('player', ...e));
        if (!connections.has(m.guild.id)) connections.set(m.guild.id, { conn, queue: [] });
        m.reply('ok!');
        d = conn.playStream(ytdl('https://www.youtube.com/watch?v=EUoe7cf0HYw', { filter: 'audioonly' }, { passes: 3 }));
      });
    } else {
      m.reply('Specify a voice channel!');
    }
  } else if (m.content.startsWith('/play')) {
    if (connections.has(m.guild.id)) {
      const url = m.content.split(' ').slice(1).join(' ')
        .replace(/</g, '')
        .replace(/>/g, '');
      const stream = ytdl(url, { filter: 'audioonly' }, { passes: 3 });
      d = m.guild.voiceConnection.playStream(stream);
      d.setBitrate(1);
      setTimeout(() => d.setBitrate(320), 5000);
    }
  } else if (m.content.startsWith('/skip')) {
    if (connections.has(m.guild.id)) {
      const connData = connections.get(m.guild.id);
      if (connData.dispatcher) {
        connData.dispatcher.end();
      }
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

function doQueue(connData) {
  const conn = connData.conn;
  const queue = connData.queue;
  const item = queue[0];
  if (!item) return;
  const stream = ytdl(item.url, { filter: 'audioonly' }, { passes: 3 });
  const dispatcher = conn.playStream(stream);
  stream.on('info', info => {
    item.m.reply(`OK, playing **${info.title}**`);
  });
  dispatcher.on('end', () => {
    queue.shift();
    doQueue(connData);
  });
  dispatcher.on('error', (...e) => console.log('dispatcher', ...e));
  connData.dispatcher = dispatcher;
}
