'use strict';

const { Collection } = require('@discordjs/collection');
const SelectMenuInteraction = require('./SelectMenuInteraction');

/**
 * Represents a {@link ComponentType.UserSelect} select menu interaction.
 * @extends {SelectMenuInteraction}
 */
class UserSelectMenuInteraction extends SelectMenuInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * Collection of the selected users
     * @type {Collection<Snowflake, User>}
     */
    this.users = new Collection();

    /**
     * Collection of the selected users
     * @type {Collection<Snowflake, GuildMember|APIGuildMember>}
     */
    this.members = new Collection();

    for (const user of Object.values(data.data.resolved.users)) {
      this.users.set(user.id, this.client.users._add(user));
    }

    if (data.data.resolved.members) {
      for (const member of Object.values(data.data.resolved.members)) {
        this.members.set(member.id, this.guild?.members._add(member) ?? member);
      }
    }
  }
}

module.exports = UserSelectMenuInteraction;
