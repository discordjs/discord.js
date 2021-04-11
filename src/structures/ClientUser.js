'use strict';

const DataResolver = require('../util/DataResolver');
const Structures = require('../util/Structures');

/**
 * Represents the logged in client's Discord user.
 * @extends {User}
 */
class ClientUser extends Structures.get('User') {
  constructor(client, data) {
    super(client, data);
    this._typing = new Map();
  }

  _patch(data) {
    super._patch(data);

    if ('verified' in data) {
      /**
       * Whether or not this account has been verified
       * @type {boolean}
       */
      this.verified = data.verified;
    }

    if ('mfa_enabled' in data) {
      /**
       * If the bot's {@link ClientApplication#owner Owner} has MFA enabled on their account
       * @type {?boolean}
       */
      this.mfaEnabled = typeof data.mfa_enabled === 'boolean' ? data.mfa_enabled : null;
    } else if (typeof this.mfaEnabled === 'undefined') {
      this.mfaEnabled = null;
    }

    if (data.token) this.client.token = data.token;
  }

  /**
   * ClientUser's presence
   * @type {Presence}
   * @readonly
   */
  get presence() {
    return this.client.presence;
  }

  /**
   * Edits the logged in client.
   * @param {Object} data The new data
   * @param {string} [data.username] The new username
   * @param {BufferResolvable|Base64Resolvable} [data.avatar] The new avatar
   */
  async edit(data) {
    const newData = await this.client.api.users('@me').patch({ data });
    this.client.token = newData.token;
    const { updated } = this.client.actions.UserUpdate.handle(newData);
    if (updated) return updated;
    return this;
  }

  /**
   * Sets the username of the logged in client.
   * <info>Changing usernames in Discord is heavily rate limited, with only 2 requests
   * every hour. Use this sparingly!</info>
   * @param {string} username The new username
   * @returns {Promise<ClientUser>}
   * @example
   * // Set username
   * client.user.setUsername('discordjs')
   *   .then(user => console.log(`My new username is ${user.username}`))
   *   .catch(console.error);
   */
  setUsername(username) {
    return this.edit({ username });
  }

  /**
   * Sets the avatar of the logged in client.
   * @param {BufferResolvable|Base64Resolvable} avatar The new avatar
   * @returns {Promise<ClientUser>}
   * @example
   * // Set avatar
   * client.user.setAvatar('./avatar.png')
   *   .then(user => console.log(`New avatar set!`))
   *   .catch(console.error);
   */
  async setAvatar(avatar) {
    return this.edit({ avatar: await DataResolver.resolveImage(avatar) });
  }

  /**
   * Options for setting activities
   * @typedef {Object} ActivitiesOptions
   * @property {string} [name] Name of the activity
   * @property {ActivityType|number} [type] Type of the activity
   * @property {string} [url] Twitch / YouTube stream URL
   */

  /**
   * Data resembling a raw Discord presence.
   * @typedef {Object} PresenceData
   * @property {PresenceStatusData} [status] Status of the user
   * @property {boolean} [afk] Whether the user is AFK
   * @property {ActivitiesOptions[]} [activities] Activity the user is playing
   * @property {?number|number[]} [shardID] Shard Id(s) to have the activity set on
   */

  /**
   * Sets the full presence of the client user.
   * @param {PresenceData} data Data for the presence
   * @returns {Presence}
   * @example
   * // Set the client user's presence
   * client.user.setPresence({ activities: [{ name: 'with discord.js' }], status: 'idle' });
   */
  setPresence(data) {
    return this.client.presence.set(data);
  }

  /**
   * A user's status. Must be one of:
   * * `online`
   * * `idle`
   * * `invisible`
   * * `dnd` (do not disturb)
   * @typedef {string} PresenceStatusData
   */

  /**
   * Sets the status of the client user.
   * @param {PresenceStatusData} status Status to change to
   * @param {?number|number[]} [shardID] Shard ID(s) to have the activity set on
   * @returns {Presence}
   * @example
   * // Set the client user's status
   * client.user.setStatus('idle');
   */
  setStatus(status, shardID) {
    return this.setPresence({ status, shardID });
  }

  /**
   * Options for setting an activity.
   * @typedef ActivityOptions
   * @type {Object}
   * @property {string} [name] Name of the activity
   * @property {string} [url] Twitch / YouTube stream URL
   * @property {ActivityType|number} [type] Type of the activity
   * @property {number|number[]} [shardID] Shard Id(s) to have the activity set on
   */

  /**
   * Sets the activity the client user is playing.
   * @param {string|ActivityOptions} [name] Activity being played, or options for setting the activity
   * @param {ActivityOptions} [options] Options for setting the activity
   * @returns {Presence}
   * @example
   * // Set the client user's activity
   * client.user.setActivity('discord.js', { type: 'WATCHING' });
   */
  setActivity(name, options = {}) {
    if (!name) return this.setPresence({ activities: null, shardID: options.shardID });

    const activity = Object.assign({}, options, typeof name === 'object' ? name : { name });
    return this.setPresence({ activities: [activity], shardID: activity.shardID });
  }

  /**
   * Sets/removes the AFK flag for the client user.
   * @param {boolean} afk Whether or not the user is AFK
   * @param {number|number[]} [shardID] Shard Id(s) to have the AFK flag set on
   * @returns {Presence}
   */
  setAFK(afk, shardID) {
    return this.setPresence({ afk, shardID });
  }
}

module.exports = ClientUser;
