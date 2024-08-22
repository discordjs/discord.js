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
    const { resolved, values } = data.data;

    /**
     * An array of the selected channel ids
     * @type {Snowflake[]}
     */
    this.values = values ?? [];

    /**
     * Collection of the selected channels
     * @type {Collection<Snowflake, BaseChannel|APIChannel>}
     */
    this.channels = new Collection();

    for (const channel of Object.values(resolved?.channels ?? {})) {
      this.channels.set(channel.id, this.client.channels._add(channel, this.guild) ?? channel);
    }
  }
}

module.exports = ChannelSelectMenuInteraction;
