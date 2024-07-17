'use strict';

const Events = require('../../../util/Events');
const Status = require('../../../util/Status');

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildMemberAddDispatch } from 'discord-api-types/v10';
 * @import WebSocketShard from '../WebSocketShard';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildMemberAddDispatch} packet The received packet
 * @param {WebSocketShard} shard The shard that the event was received on
 */
module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) {
    guild.memberCount++;
    const member = guild.members._add(data);
    if (shard.status === Status.Ready) {
      /**
       * Emitted whenever a user joins a guild.
       * @event Client#guildMemberAdd
       * @param {GuildMember} member The member that has joined a guild
       */
      client.emit(Events.GuildMemberAdd, member);
    }
  }
};
