/* eslint no-console: 0 */
'use strict';

const Discord = require('../');
const ytdl = require('ytdl-core');
const fs = require('fs')
const spawn = require('child_process').spawn;

const client = new Discord.Client({ fetchAllMembers: false, apiRequestMethod: 'sequential' });

const auth = require('./auth.json');

client.login(auth.token).then(() => console.log('logged')).catch(console.error);
const connections = new Map();

const broadcasts = new Map();;

client.on('message', m => {
  if (!m.guild) return;
  if (m.content.startsWith('/join')) {
    const channel = m.guild.channels.get(m.content.split(' ')[1]) || m.member.voiceChannel;
    if (channel && channel.type === 'voice') {
      channel.join().then(conn => {
        conn.player.on('error', (...e) => console.log('player', ...e));
        if (!connections.has(m.guild.id)) connections.set(m.guild.id, { conn, queue: [], bitrate: 64 });
        m.reply('ok!');
      });
    } else {
      m.reply('Specify a voice channel!');
    }
  } else if (m.content.match(/^\/play-(yt-(?:stream|pcm|opus)|file(?:-(?:stream|pcm|opus))?|broadcast)\s/)) {
    if (connections.has(m.guild.id)) {
      const connData = connections.get(m.guild.id);
      const queue = connData.queue;
      const type = /^\/play-(yt-(?:stream|pcm|opus)|file(?:-(?:stream|pcm|opus))?|broadcast)\s/.exec(m.content)[1]
      const source = m.content.split(' ').slice(1).join(' ')
        .replace(/</g, '')
        .replace(/>/g, '');
      queue.push({ source, m, type });
      
      if (queue.length > 1) {
        m.reply(`OK, that's going to play after ${queue.length - 1} songs`);
        return;
      }
      
      doQueue(connData);
    }
  } else if (m.content.match(/^\/play-broadcast-(yt-(?:stream|pcm|opus)|file(?:-(?:stream|pcm|opus))?)\s/)) {
      if (m.content.split(' ').length !== 3) return;
      
      const type = /^\/play-broadcast-(yt-(?:stream|pcm|opus)|file(?:-(?:stream|pcm|opus))?|broadcast)\s/.exec(m.content)[1]
      const id = m.content.split(' ')[1];
      const source = m.content.split(' ').slice(2).join(' ')
        .replace(/</g, '')
        .replace(/>/g, '');
      
      const broadcastData = broadcasts.get(id) || {broadcast: client.createVoiceBroadcast(), queue: [], ms: [], bitrate: 64};
      broadcasts.set(id, broadcastData);
      const queue = broadcastData.queue
      queue.push({ type, source })
        
      if (queue.length > 1) {
        m.reply(`OK, that's going to play after ${queue.length - 1} songs`);
        return;
      } else {
        m.reply(`OK, item was added to broadcast ${id}`);
      }
      
      doBroadcastQueue(broadcastData);
  } else if (m.content.match(/^\/set-bitrate (\d+)$/)) {
    if (connections.has(m.guild.id)) {
      const connData = connections.get(m.guild.id);
      const bitrate = parseInt(/^\/set-bitrate (\d+)$/.exec(m.content)[1], 10);
      if (isNaN(bitrate)) return;
      if (bitrate <= 16) return;
      if (Math.floor(bitrate) !== bitrate) return;
      if (bitrate % 2 !== 0) return;
      
      connData.bitrate = bitrate;
      
      if (connData.dispatcher) {
        connData.dispatcher.setBitrate(bitrate)
      }
      
      m.reply(`OK, bitrate was set to ${bitrate}`);
    }
  } else if (m.content.match(/^\/set-broadcast-bitrate ([^\s]+) (\d+)$/)) {
    const id = /^\/set-broadcast-bitrate ([^\s]+) (\d+)$/.exec(m.content)[1];
    if (broadcasts.has(id)) {
      const broadcastData = broadcasts.get(id);
      const bitrate = parseInt(/^\/set-broadcast-bitrate ([^\s]+) (\d+)$/.exec(m.content)[2], 10);
      if (isNaN(bitrate)) return;
      if (bitrate <= 16) return;
      if (Math.floor(bitrate) !== bitrate) return;
      if (bitrate % 2 !== 0) return;
      
      broadcastData.bitrate = bitrate;
      
      m.reply(`OK, bitrate was set to ${bitrate}`);
    }
  } else if (m.content === '/skip' ) {
    if (connections.has(m.guild.id)) {
      const connData = connections.get(m.guild.id);
      if (connData.dispatcher) {
        m.reply(`Ok, queue skipped`);
        connData.dispatcher.end();
      }
    }
  } else if (m.content.match(/^\/skip-broadcast ([^\s]+)$/) ) {
    const id = /^\/skip-broadcast ([^\s]+)$/.exec(m.content)[1];
    if (broadcasts.has(id)) {
      const broadcastData = broadcasts.get(id);
      broadcastData.broadcast.end();
      m.reply(`Ok, broadcast queue skipped`);
    }
  } else if (m.content.startsWith('#eval') && m.author.id === '') {
    try {
      const com = eval(m.content.split(' ').slice(1).join(' '));
      m.channel.send(com, { code: true });
    } catch (e) {
      console.log(e);
      m.channel.send(e, { code: true });
    }
  }
});


function wrapSource(source, ffmpeg) {
  // ffmpeg.stderr.pipe(process.stderr, {end: false});
  ffmpeg.stderr.resume();
  ffmpeg.stderr.on('end', function () {
    ffmpeg.stderr.unpipe(process.stderr)
  })
  
  source.on('error', (...e) => console.log('source', ...e))
  ffmpeg.on('error', (...e) => console.log('ffmpeg', ...e))
  ffmpeg.stderr.on('error', (...e) => console.log('ffmpeg.stderr', ...e))
  ffmpeg.stdin.on('error', (...e) => console.log('ffmpeg.stdin', ...e))
  
  source.pipe(ffmpeg.stdin);

  source.on('end', function() {
    ffmpeg.kill('SIGTERM')
  })
  
  source.on('error', function() {
    ffmpeg.stdout.emit('error');
  })
  
  ffmpeg.stdout.ffmpeg = ffmpeg;
  
  return ffmpeg.stdout;
}

function doQueue(connData) {
  const conn = connData.conn;
  const queue = connData.queue;
  const item = queue[0];
  if (!item) return;
  let source;
  let ffmpeg;
  let dispatcher;
  
  console.log(item.type)
  
  switch (item.type) {
    case 'yt-stream':
      source = ytdl(item.source, { filter: 'audioonly' }, { passes: 3 });
      source.on('error', (...e) => console.log('source', ...e))
      dispatcher = conn.playArbitraryInput(source, { bitrate: connData.bitrate });
      break;
    case 'yt-pcm':
      source = ytdl(item.source, { filter: 'audioonly' }, { passes: 3 });
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-ac', '2',
        '-ar', '48000',
        '-c:a', 'pcm_s16le',
        '-f', 's16le',
        '-'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      dispatcher = conn.playConvertedStream(source, { bitrate: connData.bitrate });
      break;
    case 'yt-opus':
      source = ytdl(item.source, { filter: 'audioonly' }, { passes: 3 });
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-vn',
        '-map', '0:a',
        '-acodec', 'libopus',
        '-f', 'data',
        '-sample_fmt', 's16',
        '-vbr', 'off',
        '-ar', '48000',
        '-ac', '2',
        '-ab', connData.bitrate + 'k', // Bitrate
        'pipe:1'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      dispatcher = conn.playOpusStream(source, { bitrate: connData.bitrate });
      break;
    case 'file':
      dispatcher = conn.playFile(item.source, { bitrate: connData.bitrate });
      break;
    case 'file-stream':
      source = fs.createReadStream(item.source, null);
      source.on('error', (...e) => console.log('source', ...e))
      dispatcher = conn.playArbitraryInput(source, { bitrate: connData.bitrate });
      break;
    case 'file-pcm':
      source = fs.createReadStream(item.source, null);
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-ac', '2',
        '-ar', '48000',
        '-c:a', 'pcm_s16le',
        '-f', 's16le',
        '-'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      dispatcher = conn.playConvertedStream(source, { bitrate: connData.bitrate });
      break;
    case 'file-opus':
      source = fs.createReadStream(item.source, null);
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-vn',
        '-map', '0:a',
        '-acodec', 'libopus',
        '-f', 'data',
        '-sample_fmt', 's16',
        '-vbr', 'off',
        '-ar', '48000',
        '-ac', '2',
        '-ab', connData.bitrate + 'k', // Bitrate
        '-'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      dispatcher = conn.playOpusStream(source, { bitrate: connData.bitrate });
      break;
    case "broadcast":
      if (!broadcasts.has(item.source)) {
        queue.shift();
        console.log("broadcast did'nt be played because it does not exist");
        return doQueue(connData);
      }
      dispatcher = conn.playBroadcast(broadcasts.get(item.source).broadcast, { bitrate: connData.bitrate })
      break;
    default:
      throw new Error(`unknown type: ${item.type}`)
  }

  dispatcher.on('end', () => {
    if (source && source.ffmpeg) {
      source.ffmpeg.kill('SIGKILL');
    }
    connData.dispatcher = null;
    queue.shift();
    doQueue(connData);
  });

  dispatcher.on('error', (...e) => console.log('dispatcher', ...e));
  connData.dispatcher = dispatcher;
}

const endHandles = new WeakMap();

function doBroadcastQueue(broadcastData) {
  if (broadcastData.broadcast && endHandles.has(broadcastData)) {
    broadcastData.broadcast.removeListener('end', endHandles.get(broadcastData))
  }
  
  const broadcast = broadcastData.broadcast;
  const queue = broadcastData.queue;
  const item = queue[0];
  if (!item) return;
  let source;
  let ffmpeg;

  switch (item.type) {
    case 'yt-stream':
      source = ytdl(item.source, { filter: 'audioonly' }, { passes: 3 });
      source.on('error', (...e) => console.log('source', ...e))
      broadcast.playArbitraryInput(source);
      break;
    case 'yt-pcm':
      source = ytdl(item.source, { filter: 'audioonly' }, { passes: 3 });
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-ac', '2',
        '-ar', '48000',
        '-c:a', 'pcm_s16le',
        '-f', 's16le',
        '-'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      broadcast.playConvertedStream(source);
      break;
    case 'yt-opus':
      source = ytdl(item.source, { filter: 'audioonly' }, { passes: 3 });
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-vn',
        '-map', '0:a',
        '-acodec', 'libopus',
        '-f', 'data',
        '-sample_fmt', 's16',
        '-vbr', 'off',
        '-ar', '48000',
        '-ac', '2',
        '-ab', broadcastData.bitrate + 'k', // Bitrate
        'pipe:1'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      broadcast.playOpusStream(source, { bitrate: broadcastData.bitrate });
      break;
    case 'file':
      broadcast.playFile(item.source)
      break;
    case 'file-stream':
      source = fs.createReadStream(item.source, null);
      source.on('error', (...e) => console.log('source', ...e))
      broadcast.playArbitraryInput(source);
      break;
    case 'file-pcm':
      source = fs.createReadStream(item.source, null);
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-ac', '2',
        '-ar', '48000',
        '-c:a', 'pcm_s16le',
        '-f', 's16le',
        '-'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      broadcast.playConvertedStream(source);
      break;
    case 'file-opus':
      source = fs.createReadStream(item.source, null);
      ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-vn',
        '-map', '0:a',
        '-acodec', 'libopus',
        '-f', 'data',
        '-sample_fmt', 's16',
        '-vbr', 'off',
        '-ar', '48000',
        '-ac', '2',
        '-ab', broadcastData.bitrate + 'k', // Bitrate
        '-'
      ]);
      source = wrapSource(source, ffmpeg);
      source.on('error', (...e) => console.log('source', ...e))
      broadcast.playOpusStream(source, { bitrate: broadcastData.bitrate });
      break;
    default:
      throw new Error(`unknown type: ${item.type}`)
  }
  
  function endHandle () {
    if (source && source.ffmpeg) {
      source.ffmpeg.kill('SIGKILL');
    }
    queue.shift();
    doBroadcastQueue(broadcastData)
  }
  
  endHandles.set(broadcastData, endHandle);
  broadcast.once('end', endHandle)
}
