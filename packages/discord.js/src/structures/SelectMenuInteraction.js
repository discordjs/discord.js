'use strict';

const { Collection } = require('@discordjs/collection');
const MessageComponentInteraction = require('./MessageComponentInteraction');

/**
 * Represents a select menu interaction.
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

    const { members, users, roles, channels } = data.data.resolved || {};

    if (this.isUserSelectMenu() || this.isMentionableSelectMenu()) {
      /**
       * Collection of the selected members
       * @type {Collection<Snowflake, GuildMember|APIMember>?}
       */
      this.members = new Collection();
      for (const [id, member] of Object.entries(members ?? {})) {
        const user = users[id];
        this.members.set(id, this.guild?.members._add({ user, ...member }) ?? member);
      }
    } else {
      this.members = null;
    }

    if (this.isUserSelectMenu() || this.isMentionableSelectMenu()) {
      /**
       * Collection of the selected users
       * @type {Collection<Snowflake, User|APIUser>?}
       */
      this.users = new Collection();
      for (const user of Object.values(users ?? {})) {
        this.users.set(user.id, this.client.users._add(user));
      }
    } else {
      this.users = null;
    }

    if (this.isRoleSelectMenu() || this.isMentionableSelectMenu()) {
      /**
       * Collection of the selected roles
       * @type {Collection<Snowflake, Role|APIRole>?}
       */
      this.roles = new Collection();
      for (const role of Object.values(roles ?? {})) {
        this.roles.set(role.id, this.guild?.roles._add(role) ?? role);
      }
    } else {
      this.roles = null;
    }

    if (this.isChannelSelectMenu()) {
      /**
       * Collection of the selected channels
       * @type {Collection<Snowflake, Channel|APIChannel>?}
       */
      this.channels = new Collection();
      for (const channel of Object.values(channels ?? {})) {
        this.channels.set(channel.id, this.client.channels._add(channel, this.guild) ?? channel);
      }
    } else {
      this.channels = null;
    }
  }
}

module.exports = SelectMenuInteraction;
