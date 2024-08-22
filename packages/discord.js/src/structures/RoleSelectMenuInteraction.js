'use strict';

const { Collection } = require('@discordjs/collection');
const MessageComponentInteraction = require('./MessageComponentInteraction');

/**
 * Represents a {@link ComponentType.RoleSelect} select menu interaction.
 * @extends {MessageComponentInteraction}
 */
class RoleSelectMenuInteraction extends MessageComponentInteraction {
  constructor(client, data) {
    super(client, data);
    const { resolved, values } = data.data;

    /**
     * An array of the selected role ids
     * @type {Snowflake[]}
     */
    this.values = values ?? [];

    /**
     * Collection of the selected roles
     * @type {Collection<Snowflake, Role|APIRole>}
     */
    this.roles = new Collection();

    for (const role of Object.values(resolved?.roles ?? {})) {
      this.roles.set(role.id, this.guild?.roles._add(role) ?? role);
    }
  }
}

module.exports = RoleSelectMenuInteraction;
