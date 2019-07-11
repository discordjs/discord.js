'use strict';

const { Presence } = require('./Presence');
const Collection = require('../util/Collection');
const { ActivityTypes, OPCodes } = require('../util/Constants');
const { TypeError } = require('../errors');

class ClientPresence extends Presence {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} [data={}] The data for the client presence
   */
  constructor(client, data = {}) {
    super(client, Object.assign(data, { status: 'online', user: { id: null } }));
  }

  async set(presence) {
    const packet = await this._parse(presence);
    this.patch(packet);
    if (typeof presence.shardID === 'undefined') {
      this.client.ws.broadcast({ op: OPCodes.STATUS_UPDATE, d: packet });
    } else if (Array.isArray(presence.shardID)) {
      for (const shardID of presence.shardID) {
        this.client.ws.shards.get(shardID).send({ op: OPCodes.STATUS_UPDATE, d: packet });
      }
    } else {
      this.client.ws.shards.get(presence.shardID).send({ op: OPCodes.STATUS_UPDATE, d: packet });
    }
    return this;
  }

  async _parse({ status, since, afk, activity }) { // eslint-disable-line complexity
    const applicationID = activity && (activity.application ? activity.application.id || activity.application : null);
    let assets = new Collection();
    if (activity) {
      if (typeof activity.name !== 'string') throw new TypeError('INVALID_TYPE', 'name', 'string');
      if (!activity.type) activity.type = 0;
      if (activity.assets && applicationID) {
        try {
          const a = await this.client.api.oauth2.applications(applicationID).assets.get();
          for (const asset of a) assets.set(asset.name, asset.id);
        } catch (err) { } // eslint-disable-line no-empty
      }
    }

    const packet = {
      afk: afk != null ? afk : false, // eslint-disable-line eqeqeq
      since: since != null ? since : null, // eslint-disable-line eqeqeq
      status: status || this.status,
      game: activity ? {
        type: activity.type,
        name: activity.name,
        url: activity.url,
        details: activity.details || undefined,
        state: activity.state || undefined,
        assets: activity.assets ? {
          large_text: activity.assets.largeText || undefined,
          small_text: activity.assets.smallText || undefined,
          large_image: assets.get(activity.assets.largeImage) || activity.assets.largeImage,
          small_image: assets.get(activity.assets.smallImage) || activity.assets.smallImage,
        } : undefined,
        timestamps: activity.timestamps || undefined,
        party: activity.party || undefined,
        application_id: applicationID || undefined,
        secrets: activity.secrets || undefined,
        instance: activity.instance || undefined,
      } : null,
    };

    if ((status || afk || since) && !activity) {
      packet.game = this.activity;
    }

    if (packet.game) {
      packet.game.type = typeof packet.game.type === 'number' ?
        packet.game.type : ActivityTypes.indexOf(packet.game.type);
    }

    return packet;
  }
}

module.exports = ClientPresence;
