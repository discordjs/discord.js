'use strict';

const Base = require('./Base');
const WidgetMember = require('./WidgetMember');
const Collection = require('../util/Collection');

/**
 * Represents a Widget.
 */
class Widget extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The raw data
   */
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  /**
   * Builds the widget with the provided data.
   * @param {*} data The raw data of the widget
   * @private
   */
  _patch(data) {
    /**
     * The id of the guild.
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the guild.
     * @type {string}
     */
    this.name = data.name;

    /**
     * The invite of the guild.
     * @type {?string}
     */
    this.instantInvite = data.instant_invite;

    /**
     * The list of channels in the guild.
     * @type {Collection<Snowflake, WidgetChannel>}
     */
    this.channels = new Collection();
    for (const channel of data.channels) {
      this.channels.set(channel.id, channel);
    }

    /**
     * The list of members in the guild.
     * These strings are just arbitrary numbers, they aren't Snowflakes.
     * @type {Collection<string, WidgetMember>}
     */
    this.members = new Collection();
    for (const member of data.members) {
      this.members.set(member.id, new WidgetMember(this.client, member));
    }

    /**
     * The number of the members online.
     * @type {number}
     */
    this.presenceCount = data.presence_count;
  }

  /**
   * Update the Widget.
   * @returns {Promise<Widget>}
   */
  async fetch() {
    const data = await this.client.api.guilds(this.id, 'widget.json').get();
    this._patch(data);
    return this;
  }
}

module.exports = Widget;
