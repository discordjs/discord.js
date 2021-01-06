'use strict';

const Base = require('./Base');
const WidgetChannelManager = require('../managers/WidgetChannelManager');
const WidgetUser = require('./WidgetUser');

/**
 * Represents the data about the guild any bot can preview, connected to the specified guild.
 * @extends {Base}
 */
class Widget extends Base {
  constructor(client, data, id) {
    super(client);

    if (!data) return;
    this.id = id;
    this._patch(data);

    this.members = [];
    this.channels = new WidgetChannelManager(client);
  }

  /**
   * Builds the widget with the provided data.
   * @param {*} data The raw data of the widget
   * @private
   */
  _patch(data){
    if(data?.code != 50004) {
      this.disabled = false;
      this.id = data.id;
      this.name = data.name;
      this.instant_invite = data?.instant_invite;
      if (data.channels) {
        this.channels.cache.clear();
        for (const channel of data.channels) this.channels.add(channel);
      }
      if (data.members) {
        this.members = [];
        for (const user of data.members) this.members.push(new WidgetUser(this.client, user));
      }
    }else{
      delete this.disabled;
      delete this.name;
      delete this.instant_invite;
      delete this.channels;
      this.members = [];
      this.channels.cache.clear();
      this.disabled = true;
    }
  }

  /**
   * Fetches this widget.
   * @returns {Promise<Widget>}
   */
  fetch() {
    return this.api.guilds(id)['widget.json'].get()
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

  toJSON() {
    const json = super.toJSON();
    return json;
  }
}

module.exports = Widget;
