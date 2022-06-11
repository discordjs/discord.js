'use strict';

const { GatewayOpcodes } = require('discord-api-types/v10');
const { Presence } = require('./Presence');
const { TypeError, ErrorCodes } = require('../errors');

/**
 * Represents the client's presence.
 * @extends {Presence}
 */
class ClientPresence extends Presence {
  constructor(client, data = {}) {
    super(client, Object.assign(data, { status: data.status ?? 'online', user: { id: null } }));
  }

  /**
   * Sets the client's presence
   * @param {PresenceData} presence The data to set the presence to
   * @returns {ClientPresence}
   */
  set(presence) {
    const packet = this._parse(presence);
    this._patch(packet);
    if (typeof presence.shardId === 'undefined') {
      this.client.ws.broadcast({ op: GatewayOpcodes.PresenceUpdate, d: packet });
    } else if (Array.isArray(presence.shardId)) {
      for (const shardId of presence.shardId) {
        this.client.ws.shards.get(shardId).send({ op: GatewayOpcodes.PresenceUpdate, d: packet });
      }
    } else {
      this.client.ws.shards.get(presence.shardId).send({ op: GatewayOpcodes.PresenceUpdate, d: packet });
    }
    return this;
  }

  /**
   * Parses presence data into a packet ready to be sent to Discord
   * @param {PresenceData} presence The data to parse
   * @returns {APIPresence}
   * @private
   */
  _parse({ status, since, afk, activities }) {
    const data = {
      activities: [],
      afk: typeof afk === 'boolean' ? afk : false,
      since: typeof since === 'number' && !Number.isNaN(since) ? since : null,
      status: status ?? this.status,
    };
    if (activities?.length) {
      for (const [i, activity] of activities.entries()) {
        if (typeof activity.name !== 'string') {
          throw new TypeError(ErrorCodes.InvalidType, `activities[${i}].name`, 'string');
        }
        activity.type ??= 0;

        data.activities.push({
          type: activity.type,
          name: activity.name,
          url: activity.url,
        });
      }
    } else if (!activities && (status || afk || since) && this.activities.length) {
      data.activities.push(
        ...this.activities.map(a => ({
          name: a.name,
          type: a.type,
          url: a.url ?? undefined,
        })),
      );
    }

    return data;
  }
}

module.exports = ClientPresence;

/* eslint-disable max-len */
/**
 * @external APIPresence
 * @see {@link https://discord.com/developers/docs/rich-presence/how-to#updating-presence-update-presence-payload-fields}
 */
