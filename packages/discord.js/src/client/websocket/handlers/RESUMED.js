'use strict';

const Events = require('../../../util/Events');

/**
 * @import Client from '../../Client';
 * @import { GatewayResumedDispatch } from 'discord-api-types/v10';
 * @import WebSocketShard from '../WebSocketShard';
 */

/**
 * @param {Client} client The client
 * @param {GatewayResumedDispatch} _packet The received packet
 * @param {WebSocketShard} shard The shard that the event was received on
 */
module.exports = (client, _packet, shard) => {
  const replayed = shard.sessionInfo.sequence - shard.closeSequence;
  /**
   * Emitted when a shard resumes successfully.
   * @event Client#shardResume
   * @param {number} id The shard id that resumed
   * @param {number} replayedEvents The amount of replayed events
   */
  client.emit(Events.ShardResume, shard.id, replayed);
};
