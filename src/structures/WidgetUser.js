'use strict';

const Base = require('./Base');

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
    this._patch(data);
  }

  _patch(data) {
    this.username = data.username;
    this.discriminator = "0000"; // Discord return always 0000
    this.avatar = null; // Discord return always null
    this.avatar_url = data.avatar_url;

    this.game = data?.game;
    this.status = data?.status;

    this.deaf = data?.deaf;
    this.mute = data?.mute;
    this.self_deaf = data?.self_deaf;
    this.self_mute = data?.self_mute;
    this.suppress = data?.suppress;
    this.channel_id = data?.channel_id;
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