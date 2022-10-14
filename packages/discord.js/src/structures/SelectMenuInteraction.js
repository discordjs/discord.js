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
    /**
     * Collection of the selected members
     * @type {Collection<Snowflake, GuildMember|APIMember>}
     */
    this.members = new Collection();
    /**
     * Collection of the selected users
     * @type {Collection<Snowflake, User|APIUser>}
     */
    this.users = new Collection();
    /**
     * Collection of the selected roles
     * @type {Collection<Snowflake, Role|APIRole>}
     */
    this.roles = new Collection();
    /**
     * Collection of the selected channels
     * @type {Collection<Snowflake, Channel|APIChannel>}
     */
    this.channels = new Collection();

    const { members, users, roles, channels } = data.data.resolved;

    if (members) {
      for (const [id, member] of Object.entries(members)) {
        const user = users[id];
        this.members.set(id, this.guild?.members._add({ user, ...member }) ?? member);
      }
    }

    if (users) {
      for (const [id, user] of Object.values(users)) {
        this.users.set(id, this.client.users._add(user));
      }
    }

    if (roles) {
      for (const [id, role] of Object.values(roles)) {
        this.roles.set(id, this.guild?.roles._add(role) ?? role);
      }
    }

    if (channels) {
      for (const [id, channel] of Object.values(channels)) {
        this.channels.set(id, this.client.channels._add(channel, this.guild) ?? channel);
      }
    }
  }
}

module.exports = SelectMenuInteraction;
