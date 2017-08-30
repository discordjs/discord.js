const PresenceStore = require('./DataStore');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const { Presence } = require('../structures/Presence');

class ClientPresenceStore extends PresenceStore {
  constructor(...args) {
    super(...args);
    this.clientPresence = new Presence({
      status: 'online',
      afk: false,
      since: null,
      activity: null,
    });
  }

  async setClientPresence({ status, since, afk, activity }) {
    const applicationID = activity.application ? activity.application.id || activity.application : null;
    let assets = new Collection();
    if (activity.assets && applicationID) {
      try {
        const a = await this.client.api.applications(applicationID).assets.get();
        for (const asset of a) assets.set(asset.name, asset.id);
      } catch (err) {} // eslint-disable-line no-empty
    }

    const packet = {
      afk: afk != null ? afk : false, // eslint-disable-line eqeqeq
      since: since != null ? since : null, // eslint-disable-line eqeqeq
      status: status || this.clientPresence.status,
      game: activity ? {
        type: Constants.ActivityTypes.indexOf(activity.type || 'PLAYING') || activity.type || 0,
        name: activity.name,
        url: activity.url,
        description: activity.description,
        state: activity.state,
        assets: activity.assets ? {
          large_text: activity.assets.largeText,
          small_text: activity.assets.smallText,
          large_image: assets.get(activity.assets.largeImage) || activity.assets.largeImage,
          small_image: assets.get(activity.assets.smallImage) || activity.assets.smallImage,
        } : undefined,
        application_id: applicationID || undefined,
        secrets: activity.secrets || undefined,
        instance: activity.instance || undefined,
      } : null,
    };

    this.clientPresence.patch(packet);
    this.client.ws.send({ op: Constants.OPCodes.STATUS_UPDATE, d: packet });
    return this.clientPresence;
  }
}

module.exports = ClientPresenceStore;
