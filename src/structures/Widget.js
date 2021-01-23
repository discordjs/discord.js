'use strict';

const Base = require('./Base');
const WidgetChannelManager = require('../managers/WidgetChannelManager');
const WidgetUserManager = require('../managers/WidgetUserManager');

/**
 * Represents the data about the guild any bot can preview, connected to the specified guild.
 * @extends {Base}
 */
class Widget extends Base {
  constructor(client, data, id) {
    super(client);

    this.id = id;

    this.members = new WidgetUserManager(client);
    this.channels = new WidgetChannelManager(client);

    this._patch(data);
  }

  /**
   * Builds the widget with the provided data.
   * @param {*} data The raw data of the widget
   * @private
   */
  _patch(data) {
    if (!data.code) {
      this.disabled = false;
      this.id = data.id;
      this.name = data.name;
      this.instantInvite = data.instant_invite || null;
      if (data.channels) {
        this.channels.cache.clear();
        for (const channel of data.channels) this.channels.add(channel);
      }
      if (data.members) {
        this.members.cache.clear();
        for (const user of data.members) this.members.add(user);
      }
      this.presenceCount = data.presence_count;
    } else {
      this.name = null;
      this.instantInvite = null;
      this.members.cache.clear();
      this.channels.cache.clear();
      this.disabled = true;
      this.presenceCount = 0;
    }
  }
  /**
   * Fetches this widget.
   * @returns {Promise<Widget>}
   */
  fetch() {
    return this.api
      .guilds(this.id)
      ['widget.json'].get()
      .then(data => {
        this._patch(data);
        return this;
      });
  }

  /**
   * When concatenated with a string, this automatically returns the guild's name instead of the Widget object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Guild!
   * console.log(`Hello from ${widget}!`);
   */
  toString() {
    return this.name;
  }
}

module.exports = Widget;
