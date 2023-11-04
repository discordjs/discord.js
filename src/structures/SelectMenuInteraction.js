'use strict';

const { Collection } = require('@discordjs/collection');
const MessageComponentInteraction = require('./MessageComponentInteraction');
const { Events } = require('../util/Constants');

/**
 * Represents any select menu interaction.
 * @extends {MessageComponentInteraction}
 */
class SelectMenuInteraction extends MessageComponentInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * The values selected, if the component which was interacted with was a select menu
     * @type {string[]}
     */
    this.values = data.data.values ?? [];
  }
}

module.exports.SelectMenuInteraction = SelectMenuInteraction;

/**
 * Represents a CHANNEL_SELECT interaction.
 * @extends {SelectMenuInteraction}
 */
class ChannelSelectInteraction extends SelectMenuInteraction {
  constructor(client, data) {
    super(client, data);

    const { channels } = data.data.resolved ?? {};

    /**
     * Collection of the selected channels
     * @type {Collection<Snowflake, Channel|APIChannel>}
     */
    this.channels = new Collection();
    for (const channel of Object.values(channels)) {
      this.channel.set(channel.id, this.client.channels._add(channel));
    }
  }
}

module.exports.ChannelSelectInteraction = ChannelSelectInteraction;

/**
 * Represents a ROLE_SELECT interaction.
 * @extends {SelectMenuInteraction}
 */
class RoleSelectInteraction extends SelectMenuInteraction {
  constructor(client, data) {
    super(client, data);

    const { roles } = data.data.resolved ?? {};

    /**
     * Collection of the selected roles
     * @type {Collection<Snowflake, Role|APIRole>}
     */
    this.roles = new Collection();
    for (const role of Object.values(roles)) {
      this.roles.set(role.id, this.guild?.roles._add(role) ?? role);
    }
  }
}

module.exports.RoleSelectInteraction = RoleSelectInteraction;

/**
 * Represents a USER_SELECT interaction.
 * @extends {SelectMenuInteraction}
 */
class UserSelectInteraction extends SelectMenuInteraction {
  constructor(client, data) {
    super(client, data);

    const { members, users } = data.data.resolved ?? {};

    /**
     * Collection of the selected users
     * @type {Collection<Snowflake, User>}
     */
    this.users = new Collection();
    for (const user of Object.values(users)) {
      this.users.set(user.id, this.client.users._add(user));
    }

    if (members) {
      /**
       * Collection of the selected members
       * @type {Collection<Snowflake, GuildMember|APIGuildMember>}
       */
      this.members = new Collection();
      for (const [id, member] of Object.entries(members)) {
        const user = users[id];
        if (!user) {
          this.client.emit(Events.DEBUG, `[SelectMenuInteraction] Received a member without a user, skipping ${id}`);
          continue;
        }
        this.members.set(id, this.guild?.members._add({ user, ...member }) ?? { user, ...member });
      }
    }
  }
}

module.exports.UserSelectInteraction = UserSelectInteraction;

/**
 * Represents a MENTIONABLE_SELECT interaction.
 * @extends {SelectMenuInteraction}
 */
class MentionableSelectInteraction extends SelectMenuInteraction {
  constructor(client, data) {
    super(client, data);

    const { members, users, roles, channels } = data.data.resolved ?? {};

    if (channels) {
      /**
       * Collection of the selected channels
       * @type {Collection<Snowflake, Channel|APIChannel>}
       */
      this.channels = new Collection();
      for (const channel of Object.values(channels)) {
        this.channels.set(channel.id, this.client?.channels._add(channel) ?? channel);
      }
    }

    if (members) {
      /**
       * Collection of the selected members
       * @type {Collection<Snowflake, GuildMember|APIGuildMember>}
       */
      this.members = new Collection();
      for (const [id, member] of Object.entries(members)) {
        const user = users[id];
        if (!user) {
          this.client.emit(Events.DEBUG, `[SelectMenuInteraction] Received a member without a user, skipping ${id}`);
          continue;
        }
        this.members.set(id, this.guild?.members._add({ user, ...member }) ?? { user, ...member });
      }
    }

    if (roles) {
      /**
       * Collection of the selected roles
       * @type {Collection<Snowflake, Role|APIRole>}
       */
      this.roles = new Collection();
      for (const role of Object.values(roles)) {
        this.roles.set(role.id, this.guild?.roles._add(role) ?? role);
      }
    }

    if (users) {
      /**
       * Collection of the selected users
       * @type {Collection<Snowflake, User>}
       */
      this.users = new Collection();
      for (const user of Object.values(users)) {
        this.users.set(user.id, this.client.users._add(user));
      }
    }
  }
}
module.exports.MentionableSelectInteraction = MentionableSelectInteraction;
