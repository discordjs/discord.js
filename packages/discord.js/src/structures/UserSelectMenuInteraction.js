'use strict';

const { Collection } = require('@discordjs/collection');
const MessageComponentInteraction = require('./MessageComponentInteraction');
const Events = require('../util/Events');

/**
 * Represents a {@link ComponentType.UserSelect} select menu interaction.
 * @extends {MessageComponentInteraction}
 */
class UserSelectMenuInteraction extends MessageComponentInteraction {
  constructor(client, data) {
    super(client, data);
    const { resolved, values } = data.data;

    /**
     * An array of the selected user ids
     * @type {Snowflake[]}
     */
    this.values = values ?? [];

    /**
     * Collection of the selected users
     * @type {Collection<Snowflake, User>}
     */
    this.users = new Collection();

    /**
     * Collection of the selected members
     * @type {Collection<Snowflake, GuildMember|APIGuildMember>}
     */
    this.members = new Collection();

    for (const user of Object.values(resolved?.users ?? {})) {
      this.users.set(user.id, this.client.users._add(user));
    }

    for (const [id, member] of Object.entries(resolved?.members ?? {})) {
      const user = resolved.users[id];

      if (!user) {
        this.client.emit(Events.Debug, `[UserSelectMenuInteraction] Received a member without a user, skipping ${id}`);
        continue;
      }

      this.members.set(id, this.guild?.members._add({ user, ...member }) ?? { user, ...member });
    }
  }
}

module.exports = UserSelectMenuInteraction;
