'use strict';

const assert = require('node:assert');
const { token } = require('./auth');
const { Client, Intents } = require('../src');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', async () => {
  try {
    const guild = await client.guilds.create('testing', {
      channels: [
        { name: 'afk channel', type: 'GUILD_VOICE', id: 0 },
        { name: 'system-channel', id: 1 },
      ],
      afkChannelId: 0,
      afkTimeout: 60,
      systemChannelId: 1,
    });
    console.log(guild.id);
    assert.strictEqual(guild.afkChannel.name, 'afk channel');
    assert.strictEqual(guild.afkTimeout, 60);
    assert.strictEqual(guild.systemChannel.name, 'system-channel');
    await guild.delete();
  } catch (error) {
    console.error(error);
  } finally {
    client.destroy();
  }
});

client.login(token).catch(console.error);
