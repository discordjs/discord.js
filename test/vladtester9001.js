'use strict';

const { Client } = require('../src');

const client = new Client({
  presence: { status: 'invisible' },
  shards: [0, 1],
  totalShardCount: 4,
});

let uws, zucc, zlibSync, bufferutil, utf8Validate, earl, erlpack;

uws = zucc = zlibSync = bufferutil = utf8Validate = earl = erlpack = false;

try {
  require('@discordjs/uws');
  uws = true;
} catch {
  // no-op
}

try {
  require('zucc');
  zucc = true;
} catch {
  // noop
}

try {
  require('zlib-sync');
  zlibSync = true;
} catch {
  // noop
}

try {
  require('bufferutil');
  bufferutil = true;
} catch {
  // noop
}

try {
  require('utf-8-validate');
  utf8Validate = true;
} catch {
  // noop
}

try {
  // Doesn't work, nag gus
  require('@devsnek/earl');
  earl = true;
} catch {
  // noop
}

try {
  require('erlpack');
  erlpack = true;
} catch {
  // noop
}

console.log(`
[Module List]
[WS Lib]
  uws:            ${uws}
[Compress]
  zucc:           ${zucc}
  zlib-sync:      ${zlibSync}
[ETF]
  erlpack:        ${erlpack}
  earl (busted):  ${earl}
[WS Extras]
  bufferutil:     ${bufferutil}
  utf-8-validate: ${utf8Validate}
[End Module List]
`);

client.on('debug', console.log);
client.once('ready', () => {
  console.log('ready', client.guilds.map(g => g.name));
  // console.log(client.guilds.first().members.first()._roles, client.guilds.first().members.first().roles, client.guilds.first().members.first().roles._filtered, client.guilds.first().members.first().roles.keyArray())
});

client.on('raw', packet => {
  if (!packet.t || ['GUILD_CREATE', 'PRESENCE_UPDATE', 'READY', 'MESSAGE_CREATE'].includes(packet.t)) return null;
  // console.log(packet);
  return null;
});

client.on('message', message => {
  if (message.content === 'owo') {
    client.ws.shards.forEach(shard => shard.connection.close(Math.random() > 0.5 ? 4000 : 1000));
  }
  if (message.content === 'uwu') client.ws.destroy();
  if (message.content === 'OWO') client.destroy();
  if (message.content === '1000') client.ws.shards.get(0).connection.close(1000);
  if (message.content === '1001') client.ws.shards.get(0).connection.close(1001);
  if (message.content === '1002') client.ws.shards.get(0).connection.close(1002);
  if (message.content === '1003') client.ws.shards.get(0).connection.close(1003);
  if (message.content === '1004') client.ws.shards.get(0).connection.close(1004);
  if (message.content === '1005') client.ws.shards.get(0).connection.close(1005);
  if (message.content === '3001') client.ws.shards.get(0).connection.close(3001);
  if (message.content === '4000') client.ws.shards.get(0).connection.close(4000);
});

client.on('shardError', console.log);

client.login('NDEwNTA3MTQyOTc0NjY4ODAw.XKD87A.LFKowibFLyPlC0V1GyNGUJwa7t0').catch(console.error);
