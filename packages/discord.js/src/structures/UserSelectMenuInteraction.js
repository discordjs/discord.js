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
     * @type {Collection<Snowflake, User|APIUser>}
     */
    this.users = new Collection();
    for (const user of Object.values(data.data.resolved.users)) {
      this.users.set(user.id, this.client.users._add(user) ?? user);
    }

    if (data.data.resolved.members) {
      this.members = new Collection()
      /**
       * Collection of the selected users
       * @type {Collection<Snowflake, GuildMember|APIGuildMember>?}
       */
      for (const [id, member] of Object.entries(data.data.resolved.members)) {
        const user = data.data.resolved.users[id];
        this.members.set(id, this.guild?.members._add({ user, ...member }) ?? member);
      }
    } else {
      this.members = null;
    }
  }
}

module.exports = UserSelectMenuInteraction;
