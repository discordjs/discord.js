'use strict';

const Base = require('./Base');
const Presence = require('./Presence').Presence;
const WidgetVoiceState = require('./WidgetVoiceState');
/**
 * Represents a user on a Widget of Discord.
 * @extends {Base}
 */
class WidgetUser extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the user
   */
  constructor(client, data) {
    super(client);
    this.id = data.id;
    this._patch(data);
  }

  _patch(data) {
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar || null;
    this.avatarURL = data.avatar_url;
    this.game = data.game ? new Presence(this.client, { ...data.game, user: { id: data.id } }) : null;
    this.status = data.status;
    this.voice = data.channel_id ? new WidgetVoiceState(this.client, data) : null;
  }

  equals(user) {
    return user && this.username === user.username && this.avatar_url === user.avatar_url;
  }

  /**
   * Give the username
   * @returns {string}
   * @example
   * // Logs: Hello from Someone!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return this.username;
  }
}

module.exports = WidgetUser;
