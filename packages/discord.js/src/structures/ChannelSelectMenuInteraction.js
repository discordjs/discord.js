'use strict';

const { Collection } = require('@discordjs/collection');
const MessageComponentInteraction = require('./MessageComponentInteraction');

/**
 * Represents a {@link ComponentType.ChannelSelect} select menu interaction.
 * @extends {MessageComponentInteraction}
 */
class ChannelSelectMenuInteraction extends MessageComponentInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * An array of the selected channel ids
     * @type {Snowflake[]}
     */
    this.values = data.data.values ?? [];

    /**
     * Collection of the selected channels
     * @type {Collection<Snowflake, Channel|APIChannel>}
     */
    this.channels = new Collection();
    for (const channel of Object.values(data.data.resolved.channels)) {
      this.channels.set(channel.id, this.client.channels._add(channel, this.guild) ?? channel);
    }
  }
}

module.exports = ChannelSelectMenuInteraction;
