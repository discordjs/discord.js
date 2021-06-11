/// <reference path="index.d.ts" />

import { Client, Intents, Message, MessageAttachment, MessageEmbed } from 'discord.js';

const client: Client = new Client({
  intents: Intents.NON_PRIVILEGED,
});

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

// These are to check that stuff is the right type
declare const assertIsMessage: (m: Promise<Message>) => void;
declare const assertIsMessageArray: (m: Promise<Message[]>) => void;

client.on('message', ({ channel }) => {
  assertIsMessage(channel.send('string'));
  assertIsMessage(channel.send({}));
  assertIsMessage(channel.send({ embed: {} }));

  const attachment = new MessageAttachment('file.png');
  const embed = new MessageEmbed();
  assertIsMessage(channel.send({ files: [attachment] }));
  assertIsMessage(channel.send(embed));
  assertIsMessage(channel.send({ embed, files: [attachment] }));

  assertIsMessageArray(channel.send({ split: true }));

  // @ts-expect-error
  channel.send();
  // @ts-expect-error
  channel.send({ another: 'property' });
});

client.login('absolutely-valid-token');
