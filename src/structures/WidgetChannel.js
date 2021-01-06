'use strict';

const Base = require('./Base');

/**
 * Represents a channel on a Widget of Discord.
 * @extends {Base}
 */
class WidgetChannel extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the widgetChannel
   */
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    this.id = data.id;
    this.name = data.name;
    this.position = data.position;
  }

  toString() {
    return `<#${this.id}>`;
  }
}

module.exports = WidgetChannel;
