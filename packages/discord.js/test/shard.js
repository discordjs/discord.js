import process from 'node:process';
import { setTimeout } from 'node:timers';
import { GatewayIntentBits } from 'discord-api-types/v10';
import { token } from './auth.json';
import { Client, Events } from '../src/index.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  shards: process.argv[2],
  shardCount: process.argv[3],
});

client.on(Events.ClientReady, msg => {
  if (msg.content.startsWith('?eval') && msg.author.id === '66564597481480192') {
    try {
      const com = eval(msg.content.split(' ').slice(1).join(' '));
      msg.channel.send(com, { code: true });
    } catch (e) {
      msg.channel.send(e, { code: true });
    }
  }
});

process.send(123);

client.on(Events.ClientReady, readyClient => {
  console.log('Ready', readyClient.options.shards);
  if (readyClient.options.shards === 0) {
    setTimeout(async () => {
      console.log('kek dying');
      await client.destroy();
    }, 5_000);
  }
});

client.login(token).catch(console.error);
