'use strict';

const { BaseSelectMenuComponent } = require('./BaseSelectMenuComponent.js');

/**
 * Represents a channel select menu component
 *
 * @extends {BaseSelectMenuComponent}
 */
class ChannelSelectMenuComponent extends BaseSelectMenuComponent {
  /**
   * The options in this select menu
   *
   * @type {?(ChannelType[])}
   * @readonly
   */
  get channelTypes() {
    return this.data.channel_types ?? null;
  }
}

exports.ChannelSelectMenuComponent = ChannelSelectMenuComponent;
