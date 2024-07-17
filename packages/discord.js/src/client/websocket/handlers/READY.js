'use strict';

const ClientApplication = require('../../../structures/ClientApplication');
let ClientUser;

/**
 * @import Client from '../../Client';
 * @import { GatewayReadyDispatch } from 'discord-api-types/v10';
 * @import WebSocketShard from '../WebSocketShard';
 */

/**
 * @param {Client} client The client
 * @param {GatewayReadyDispatch} packet The received packet
 * @param {WebSocketShard} shard The shard that the event was received on
 */
module.exports = (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    ClientUser ??= require('../../../structures/ClientUser');
    client.user = new ClientUser(client, data.user);
    client.users.cache.set(client.user.id, client.user);
  }

  for (const guild of data.guilds) {
    guild.shardId = shard.id;
    client.guilds._add(guild);
  }

  if (client.application) {
    client.application._patch(data.application);
  } else {
    client.application = new ClientApplication(client, data.application);
  }

  shard.checkReady();
};
