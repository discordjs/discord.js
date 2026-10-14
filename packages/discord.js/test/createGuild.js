import assert from 'node:assert';
import { ChannelType, GatewayIntentBits } from 'discord-api-types/v10';
import { token } from './auth.js';
import { Client, Events } from '../src/index.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on(Events.ClientReady, async readyClient => {
  try {
    const guild = await readyClient.guilds.create('testing', {
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
    await readyClient.destroy();
  }
});

client.login(token).catch(console.error);
