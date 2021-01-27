'use strict';

const { token, serverId, channelId, messageId } = require('./auth.js');
const { Client, ReactionCollector } = require('../src');

const client = new Client();

client.on('ready', async () => {
  const server = client.servers.cache.get(serverId);

  const channel = server.channels.cache.get(channelId);

  const message = await channel.messages.fetch(messageId);

  await message.react('🔔');
  // Await message.reactions.removeAll();

  const collector = new ReactionCollector(message, () => true, { dispose: true });

  collector.on('collect', () => {
    console.log('collected');
  });

  collector.on('create', () => {
    console.log('created');
  });

  collector.on('remove', () => {
    console.log('removed');
  });

  collector.on('dispose', () => {
    console.log('disposed');
  });
});

client.login(token);
