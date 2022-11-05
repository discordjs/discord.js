'use strict';

const { Collection } = require('@discordjs/collection');
const MessageComponentInteraction = require('./MessageComponentInteraction');
const { Events } = require('../util/Constants');

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

    /**
     * Collection of the selected roles
     * @type {Collection<Snowflake, Channel|APIChannel>}
     */
    this.channels = new Collection();

    const { members, users, roles, channels } = data.data.resolved ?? {};

    if (members) {
      for (const [id, member] of Object.entries(members)) {
        const user = users[id];
        if (!user) {
          this.client.emit(Events.DEBUG, `[SelectMenuInteraction] Received a member without a user, skipping ${id}`);
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

    if (channels) {
      for (const channel of Object.values(channels)) {
        this.channels.set(channel.id, this.client?.channels._add(channel) ?? channel);
      }
    }
  }
}

module.exports = SelectMenuInteraction;
