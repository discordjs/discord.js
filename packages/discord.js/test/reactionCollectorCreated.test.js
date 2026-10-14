import { GatewayIntentBits } from 'discord-api-types/v10';
import { token, guildId, channelId, messageId } from './auth.js';
import { Client, Events, ReactionCollector } from '../src/index.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
});

client.on(Events.ClientReady, async readyClient => {
  const guild = readyClient.guilds.cache.get(guildId);

  const channel = guild.channels.cache.get(channelId);

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
