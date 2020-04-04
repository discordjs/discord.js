/// <reference path="index.d.ts" />

import { Client } from 'discord.js';

const client: Client = new Client();

client.on('ready', () => {
  console.log(`Client is logged in as ${client.user!.tag} and ready!`);
});

client.on('guildCreate', g => {
  const channel = g.channels.cache.random();
  if (!channel) return;

  channel.setName('foo').then(updatedChannel => {
    console.log(`New channel name: ${updatedChannel.name}`);
  });
});

client.on('messageReactionRemoveAll', async message => {
  console.log(`messageReactionRemoveAll - id: ${message.id} (${message.id.length})`);

  if (message.partial) message = await message.fetch();

  console.log(`messageReactionRemoveAll - content: ${message.content}`);
});

client.login('absolutely-valid-token');
