'use strict';

const { promises: fs } = require('fs');
const { createLogger } = require('../utils');
const { guildID, emojiID } = require('../config.json');

const log = createLogger('emojis');

async function getEmojis(client) {
  const guild = client.guilds.get(guildID);
  for (let i = 0; i < 50; i++) {
    await guild.emojis.fetch();
  }
}

async function getEmoji(client) {
  const guild = client.guilds.get(guildID);
  for (let i = 0; i < 50; i++) {
    guild.emojis.delete(emojiID);
    await guild.emojis.fetch(emojiID);
  }
}

async function createEmoji(client) {
  const emoji = await fs.readFile('../emoji.png');
  const guild = client.guilds.get(guildID);
  const emojis = new Map();
  for (let i = 0; i < 25; i++) {
    const d = await guild.emojis.create(emoji, `test-${i + 1}`);
    emojis.set(d.id, d);
  }

  return emojis;
}

async function patchEmoji(emojis) {
  for (const emoji of emojis.values()) {
    await emoji.edit({ name: `edited-${emoji.name}` });
  }
}

async function deleteEmoji(emojis) {
  for (const emoji of emojis.values()) {
    await emoji.delete();
  }
}

async function runTests(client) {
  log('get', '/guilds/{guild.id}/emojis');
  await getEmojis(client);

  log('get', '/guilds/{guild.id}/emojis/{emoji.id}');
  await getEmoji(client);

  log('post', '/guilds/{guild.id}/emojis');
  const emojis = await createEmoji(client);

  log('patch', '/guilds/{guild.id}/emojis/{emoji.id}');
  await patchEmoji(emojis);

  log('delete', '/guilds/{guild.id}/emojis/{emoji.id}');
  await deleteEmoji(emojis);
}

module.exports = runTests;
