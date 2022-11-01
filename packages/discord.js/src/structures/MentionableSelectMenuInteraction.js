'use strict';

const { Collection } = require('@discordjs/collection');
const MessageComponentInteraction = require('./MessageComponentInteraction');
const Events = require('../util/Events');

/**
 * Represents a {@link ComponentType.MentionableSelect} select menu interaction.
 * @extends {MessageComponentInteraction}
 */
class MentionableSelectMenuInteraction extends MessageComponentInteraction {
  constructor(client, data) {
    super(client, data);

    const { members, users, roles } = data.data.resolved ?? {};

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

    /**
     * Collection of the selected roles
     * @type {Collection<Snowflake, Role|APIRole>}
     */
    this.roles = new Collection();

    if (members) {
      for (const [id, member] of Object.entries(members)) {
        const user = users[id];
        if (!user) {
          this.client.emit(
            Events.Debug,
            `[MentionableSelectMenuInteraction] Received a member without a user, skipping ${id}`,
          );

          continue;
        }

        this.members.set(id, this.guild?.members._add({ user, ...member }) ?? { user, ...member });
      }
    }

    if (users) {
      for (const user of Object.values(users)) {
        this.users.set(user.id, this.client.users._add(user));
      }
    }

    if (roles) {
      for (const role of Object.values(roles)) {
        this.roles.set(role.id, this.guild?.roles._add(role) ?? role);
      }
    }
  }
}

module.exports = MentionableSelectMenuInteraction;
