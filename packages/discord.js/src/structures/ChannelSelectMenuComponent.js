import { BaseSelectMenuComponent } from './BaseSelectMenuComponent.js';

/**
 * Represents a channel select menu component
 *
 * @extends {BaseSelectMenuComponent}
 */
export class ChannelSelectMenuComponent extends BaseSelectMenuComponent {
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
