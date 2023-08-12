'use strict';

const { Presence } = require('./Presence');
const { TypeError } = require('../errors');
const { ActivityTypes, Opcodes } = require('../util/Constants');

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
      this.client.ws.broadcast({ op: Opcodes.STATUS_UPDATE, d: packet });
    } else if (Array.isArray(presence.shardId)) {
      for (const shardId of presence.shardId) {
        this.client.ws.shards.get(shardId).send({ op: Opcodes.STATUS_UPDATE, d: packet });
      }
    } else {
      this.client.ws.shards.get(presence.shardId).send({ op: Opcodes.STATUS_UPDATE, d: packet });
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
        if (typeof activity.name !== 'string') throw new TypeError('INVALID_TYPE', `activities[${i}].name`, 'string');

        activity.type ??= ActivityTypes.PLAYING;

        if (activity.type === ActivityTypes.CUSTOM && !activity.state) {
          activity.state = activity.name;
          activity.name = 'Custom Status';
        }

        data.activities.push({
          type: typeof activity.type === 'number' ? activity.type : ActivityTypes[activity.type],
          name: activity.name,
          state: activity.state,
          url: activity.url,
        });
      }
    } else if (!activities && (status || afk || since) && this.activities.length) {
      data.activities.push(
        ...this.activities.map(a => ({
          name: a.name,
          type: ActivityTypes[a.type],
          state: a.state ?? undefined,
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
