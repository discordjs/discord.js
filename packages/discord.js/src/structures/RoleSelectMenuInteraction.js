'use strict';
const { Collection } = require('@discordjs/collection');
const SelectMenuInteraction = require('./SelectMenuInteraction');
/**
 * Represents a {@link ComponentType.RoleSelect} select menu interaction.
 * @extends {SelectMenuInteraction}
 */
class RoleSelectMenuInteraction extends SelectMenuInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * Collection of the selected roles
     * @type {Collection<Snowflake, Role|APIRole>}
     */
    this.roles = new Collection();
    for (const role of Object.values(data.data.resolved.roles)) {
      this.roles.set(role.id, this.guild?.roles._add(role) ?? role);
    }
  }
}
module.exports = RoleSelectMenuInteraction;
