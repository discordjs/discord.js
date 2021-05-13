'use strict';

const Base = require('./Base');
const Collection = require('../util/Collection');

/**
 * Represents a Widget.
 */
class Widget extends Base {
  /**
   * @param {Client} client - The instantiating client
   * @param {Object} data - The raw data;
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
     * When a widget is disable, data will always send a code. When it's enable, data doesn't have a code.
     */
    if ('code' in data) {
      /**
       * The code provide with the data.
       * @type {?number}
       */
      this.code = data.code;

      /**
       * The error message.
       * @type {?string}
       */
      this.message = data.message;

      /**
       * Check if the guild has the widget enabled or not.
       * @type {boolean}
       */
      this.enabled = false;
    } else {
      /**
       * The id of the guild.
       * @type {?string}
       */
      this.id = data.id;

      /**
       * The name of the guild.
       * @type {?string}
       */
      this.name = data.name;

      /**
       * The invite of the guild.
       * @type {?string | ?null}
       */
      this.instant_invite = data.instant_invite;

      /**
       * The list of channels in the guild.
       * @type {Collection<string, WidgetChannel>}
       */
      this.channels = new Collection();
      for (const channel of data.channels) {
        this.channels.set(channel.id, channel);
      }

      /**
       * The list of members in the guild.
       * @type {Collection<string, WidgetMember>}
       */
      this.members = new Collection();
      for (const member of data.members) {
        this.members.set(member.id, member);
      }

      /**
       * The number of the members online.
       * @type {?number}
       */
      this.presence_count = data.presence_count;

      this.enabled = true;
    }
  }
}

module.exports = Widget;
