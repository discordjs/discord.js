'use strict';

const { createLogger } = require('../utils');
const { guildID, channelID, clientID, roleID, bannedUserID } = require('../config.json');

const log = createLogger('guilds');

async function getGuild(client) {
  for (let i = 0; i < 50; i++) {
    await client.api.guilds(guildID).get();
  }
}

async function patchGuild(client) {
  const guild = client.guild.get(guildID);
  for (let i = 0; i < 25; i++) {
    await guild.setName(guild.name);
  }
}

async function patchChannels(client) {
  const channel = await client.channels.get(channelID);
  for (let i = 0; i < 25; i++) {
    await channel.setPosition(2);
  }
}

async function getGuildMember(client) {
  const guild = client.guilds.get(guildID);
  for (let i = 0; i < 50; i++) {
    guild.members.delete(clientID);
    await guild.members.fetch(clientID);
  }
}

async function getGuildMembers(client) {
  for (let i = 0; i < 50; i++) {
    await client.api.guilds(guildID).members.get();
  }
}

async function patchMember(client) {
  for (let i = 0; i < 25; i++) {
    await client.api.guilds(guildID).members(clientID).patch({ data: { nick: 'Test' } });
  }
}

async function patchNicknameMe(client) {
  const guild = client.guilds.get(guildID);
  const me = await guild.members.fetch(clientID);
  for (let i = 0; i < 25; i++) {
    await me.setNickname('@me test');
  }
}

async function patchDeleteRole(client) {
  const guild = client.guilds.get(guildID);
  const me = await guild.members.fetch(clientID);
  for (let i = 0; i < 25; i++) {
    await me.roles.add(roleID);
    await me.roles.remove(roleID);
  }
}

async function getBans(client) {
  const guild = client.guilds.get(guildID);
  for (let i = 0; i < 50; i++) {
    await guild.fetchBans();
  }
}

async function getBan(client) {
  for (let i = 0; i < 50; i++) {
    await client.api.guilds(guildID).bans(bannedUserID).get();
  }
}

async function putDeleteBan(client) {
  const guild = client.guilds.get(guildID);
  for (let i = 0; i < 25; i++) {
    await guild.members.ban(bannedUserID);
    await guild.members.unban(bannedUserID);
  }
}

async function runTests(client) {
  log('get', '/guilds/{guild.id}');
  await getGuild(client);

  log('patch', '/guilds/{guild.id}');
  await patchGuild(client);

  log('patch', '/guilds/{guild.id}/channels', 'Setting Position');
  await patchChannels(client);

  log('get', '/guilds/{guild.id}/members/{user.id}');
  await getGuildMember(client);

  log('get', '/guilds/{guild.id}/members');
  await getGuildMembers(client);

  log('patch', '/guilds/{guild.id}/members/{user.id}');
  await patchMember(client);

  log('patch', '/guilds/{guild.id}/members/@me/nick');
  await patchNicknameMe(client);

  log('patch/delete', '/guilds/{guild.id}/members/{user.id}/roles/{role.id}');
  await patchDeleteRole(client);

  log('get', '/guilds/{guild.id}/bans');
  await getBans(client);

  log('get', '/guilds/{guild.id}/bans/{user.id}');
  await getBan(client);

  log('put/delete', '/guilds/{guild.id}/bans/{user.id}');
  await putDeleteBan(client);
}

module.exports = runTests;
