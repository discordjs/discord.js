'use strict';

const { createLogger } = require('../utils');
const { guildID, channelID, messageID, clientID } = require('../config.json');

/* eslint-disable max-len */

const log = createLogger('channels');

async function getChannel(client) {
  for (let i = 0; i < 50; i++) {
    await client.api.channels(channelID).get();
  }
}

async function updateChannel(client) {
  const channel = client.channels.get(channelID);
  for (let i = 0; i < 50; i++) {
    await channel.setTopic(`Test ${i + 1}`);
  }
}

async function createChannels(client) {
  const guild = client.guilds.get(guildID);
  const channels = new Map();

  for (let i = 0; i < 25; i++) {
    const d = await guild.channels.create(`test-${i + 1}`, { reason: 'Testing creation' });
    channels.set(d.id, d);
  }

  return channels;
}

async function deleteChannels(_, channels) {
  for (const channel of channels.values()) {
    await channel.delete('Testing Deletions');
  }
}

async function getMessages(client) {
  const channel = client.channels.get(channelID);
  for (let i = 0; i < 50; i++) {
    await channel.messages.fetch();
  }
}

async function getMessage(client) {
  const channel = client.channels.get(channelID);
  for (let i = 0; i < 50; i++) {
    channel.messages.delete(messageID);
    await channel.messages.fetch(messageID);
  }
}

async function postMessages(client) {
  const channel = client.channels.get(channelID);
  const messages = new Map();
  for (let i = 0; i < 25; i++) {
    const d = await channel.send(`Test ${i + 1}`);
    messages.set(d.id, d);
  }

  return messages;
}

async function putReactions(messages) {
  for (const m of messages.values()) {
    await m.react('👂');
  }
}

async function deleteReaction(messages) {
  const ear = encodeURIComponent('👂');
  let client;
  for (const m of messages.values()) {
    if (!client) ({ client } = m);
    await client.api.channels(m.channel.id).messages(m.id).reactions(ear, clientID).delete();
  }
}

async function getReaction(client) {
  const emoji = encodeURIComponent('😏');
  await client.api
    .channels(channelID)
    .messages(messageID)
    .reactions(emoji, '@me')
    .put();
  for (let i = 0; i < 50; i++) {
    await client.api.channels(channelID).messages(messageID).reactions(emoji).get();
  }
}

async function deleteReactions(messages) {
  for (const m of messages.values()) {
    await m.reactions.removeAll();
  }
}

async function patchMessages(messages) {
  for (const m of messages.values()) {
    await m.edit(`Edited: ${m.content}`);
  }
}

async function deleteMessages(messages) {
  for (const m of messages.values()) {
    await m.delete();
  }
}

async function bulkDelete(client, messages) {
  const channel = client.channels.get(channelID);
  await channel.bulkDelete(messages);
}

async function putOverwrite(client, channels) {
  for (const channel of channels.values()) {
    await channel.updateOverwrite(client.user, {
      SEND_MESSAGES: true,
    });
  }
}

async function deleteOverwrites(channels) {
  for (const channel of channels.values()) {
    for (const overwrite of channel.permissionOverwrites.values()) {
      await overwrite.delete();
    }
  }
}

async function getInvites(client) {
  const channel = client.channels.get(channelID);
  for (let i = 0; i < 50; i++) {
    await channel.fetchInvites();
  }
}

async function postInvites(client) {
  const channel = client.channels.get(channelID);
  const invites = new Map();
  for (let i = 0; i < 25; i++) {
    const d = await channel.createInvite();
    invites.set(d.code, d);
  }

  return invites;
}

async function postTyping(client) {
  for (let i = 0; i < 25; i++) {
    await client.api.channels(channelID).typing.post();
  }
}

async function getPins(client) {
  const channel = client.channels.get(channelID);
  for (let i = 0; i < 50; i++) {
    await channel.messages.fetchPinned();
  }
}

async function putPins(messages) {
  for (const m of messages.values()) {
    await m.pin();
  }
}

async function deletePins(messages) {
  for (const m of messages.values()) {
    await m.unpin();
  }
}

async function runTests(client) {
  log('get', '/channels/{channel.id}');
  await getChannel(client);

  log('patch', '/channels/{channel.id}');
  await updateChannel(client);

  log('post', '/guilds/{guild.id}/channels');
  const channels = await createChannels(client);

  log('delete', '/channels/{channel.id}');
  await deleteChannels(client, channels);

  log('get', '/channels/{channel.id}/messages');
  await getMessages(client);

  log('get', '/channels/{channel.id}/messages/{message.id}');
  await getMessage(client);

  log('post', '/channels/{channel.id}/messages');
  const messages = await postMessages(client);

  log('put', '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me', 'Shared bucket: /channels/{channel.id}/messages/:id/reactions/*');
  await putReactions(messages);

  // TODO: Check that ratelimits don't fuck up with this
  log('delete', '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}', 'Shared bucket: /channels/{channel.id}/messages/:id/reactions/*');
  await deleteReaction(messages);

  log('get', '/channels/{channel.id}/messages/{message.id}/reactions/{emoji}');
  await getReaction(client);

  log('delete', '/channels/{channel.id}/messages/{message.id}/reactions');
  const messages2 = await postMessages(client);
  await putReactions(messages2);
  await deleteReactions(messages2);

  log('patch', '/channels/{channel.id}/messages/{message.id}');
  const messages3 = await postMessages(client);
  await patchMessages(messages3);

  log('delete', '/channels/{channel.id}/messages/{message.id}');
  await deleteMessages(messages3);

  log('post', '/channels/{channel.id}/messages/bulk-delete');
  await bulkDelete(client, messages);
  await bulkDelete(client, messages2);

  log('put', '/channels/{channel.id}/permissions/{overwrite.id}');
  const channels2 = await createChannels(client);
  await putOverwrite(client, channels2);

  log('delete', '/channels/{channel.id}/permissions/{overwrite.id}');
  await deleteOverwrites(channels2);

  log('get', '/channels/{channel.id}/invites');
  await getInvites(client);

  log('post', '/channels/{channel.id}/invites');
  const invites = await postInvites(client);

  log('post', '/channels/{channel.id}/typing');
  await postTyping(client);

  log('get', '/channels/{channel.id}/pins');
  await getPins(client);

  log('put', '/channels/{channel.id}/pins/{message.id}');
  const messages4 = await postMessages(client);
  await putPins(messages4);

  log('delete', '/channels/{channel.id}/pins/{message.id}');
  await deletePins(messages4);

  return invites;
}


module.exports = runTests;
