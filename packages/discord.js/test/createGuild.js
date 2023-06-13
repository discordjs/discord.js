'use strict';

const assert = require('node:assert');
const { ChannelType, GatewayIntentBits } = require('discord-api-types/v10');
const { token } = require('./auth');
const { Client } = require('../src');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', async () => {
  try {
    const guild = await client.guilds.create('testing', {
      channels: [
        { name: 'afk channel', type: ChannelType.GuildVoice, id: 0 },
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
    await client.destroy();
  }
});

client.login(token).catch(console.error);
