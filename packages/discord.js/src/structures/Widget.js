'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const { Base } = require('./Base.js');
const { WidgetMember } = require('./WidgetMember.js');

/**
 * Represents a Widget.
 *
 * @extends {Base}
 */
class Widget extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  /**
   * Represents a channel in a Widget
   *
   * @typedef {Object} WidgetChannel
   * @property {Snowflake} id Id of the channel
   * @property {string} name Name of the channel
   * @property {number} position Position of the channel
   */

  _patch(data) {
    /**
     * The id of the guild.
     *
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('name' in data) {
      /**
       * The name of the guild.
       *
       * @type {string}
       */
      this.name = data.name;
    }

    if ('instant_invite' in data) {
      /**
       * The invite of the guild.
       *
       * @type {?string}
       */
      this.instantInvite = data.instant_invite;
    }

    /**
     * The list of channels in the guild.
     *
     * @type {Collection<Snowflake, WidgetChannel>}
     */
    this.channels = new Collection();
    for (const channel of data.channels) {
      this.channels.set(channel.id, channel);
    }

    /**
     * The list of members in the guild.
     * These strings are just arbitrary numbers, they aren't Snowflakes.
     *
     * @type {Collection<string, WidgetMember>}
     */
    this.members = new Collection();
    for (const member of data.members) {
      this.members.set(member.id, new WidgetMember(this.client, member));
    }

    if ('presence_count' in data) {
      /**
       * The number of members online.
       *
       * @type {number}
       */
      this.presenceCount = data.presence_count;
    }
  }

  /**
   * Update the Widget.
   *
   * @returns {Promise<Widget>}
   */
  async fetch() {
    const data = await this.client.rest.get(Routes.guildWidgetJSON(this.id));
    this._patch(data);
    return this;
  }

  /**
   * Returns a URL for the PNG widget of the guild.
   *
   * @param {GuildWidgetStyle} [style] The style for the widget image
   * @returns {string}
   */
  imageURL(style) {
    return this.client.guilds.widgetImageURL(this.id, style);
  }
}

exports.Widget = Widget;
