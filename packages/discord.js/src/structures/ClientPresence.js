/* eslint-disable id-length */
'use strict';

const { GatewayOpcodes, ActivityType } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { Presence } = require('./Presence.js');

/**
 * Represents the client's presence.
 *
 * @extends {Presence}
 */
class ClientPresence extends Presence {
  constructor(client, data = {}) {
    super(client, Object.assign(data, { status: data.status ?? 'online', user: { id: null } }));
  }

  /**
   * Sets the client's presence
   *
   * @param {PresenceData} presence The data to set the presence to
   * @returns {Promise<ClientPresence>}
   */
  async set(presence) {
    const packet = this._parse(presence);
    this._patch(packet);
    if (presence.shardId === undefined) {
      await this.client._broadcast({ op: GatewayOpcodes.PresenceUpdate, d: packet });
    } else if (Array.isArray(presence.shardId)) {
      await Promise.all(
        presence.shardId.map(shardId => this.client.ws.send(shardId, { op: GatewayOpcodes.PresenceUpdate, d: packet })),
      );
    } else {
      await this.client.ws.send(presence.shardId, { op: GatewayOpcodes.PresenceUpdate, d: packet });
    }

    return this;
  }

  /**
   * Parses presence data into a packet ready to be sent to Discord
   *
   * @param {PresenceData} presence The data to parse
   * @returns {GatewayPresenceUpdateData}
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
          throw new DiscordjsTypeError(ErrorCodes.InvalidType, `activities[${i}].name`, 'string');
        }

        activity.type ??= ActivityType.Playing;

        if (activity.type === ActivityType.Custom && !activity.state) {
          activity.state = activity.name;
          activity.name = 'Custom Status';
        }

        data.activities.push({
          type: activity.type,
          name: activity.name,
          state: activity.state,
          url: activity.url,
        });
      }
    } else if (!activities && (status || afk || since) && this.activities.length) {
      data.activities.push(
        ...this.activities.map(activity => ({
          name: activity.name,
          state: activity.state ?? undefined,
          type: activity.type,
          url: activity.url ?? undefined,
        })),
      );
    }

    return data;
  }
}

exports.ClientPresence = ClientPresence;
