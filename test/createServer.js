'use strict';

const assert = require('assert');
const { token } = require('./auth');
const { Client } = require('../src');

const client = new Client();

client.on('ready', async () => {
  try {
    const server = await client.servers.create('testing', {
      channels: [
        { name: 'afk channel', type: 'voice', id: 0 },
        { name: 'system-channel', id: 1 },
      ],
      afkChannelID: 0,
      afkTimeout: 60,
      systemChannelID: 1,
    });
    console.log(server.id);
    assert.strictEqual(server.afkChannel.name, 'afk channel');
    assert.strictEqual(server.afkTimeout, 60);
    assert.strictEqual(server.systemChannel.name, 'system-channel');
    await server.delete();
    client.destroy();
  } catch (error) {
    console.error(error);
  }
});

client.login(token).catch(console.error);
