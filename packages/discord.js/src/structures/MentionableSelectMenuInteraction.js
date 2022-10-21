'use strict';
const { Collection } = require('@discordjs/collection');
const SelectMenuInteraction = require('./SelectMenuInteraction');
/**
 * Represents a {@link ComponentType.MentionableSelect} select menu interaction.
 * @extends {SelectMenuInteraction}
 */
class MentionableSelectMenuInteraction extends SelectMenuInteraction {
    constructor(client, data) {
        super(client, data);
        const { members, users, roles } = data.data.resolved || {};

        if (members) {
          /**
           * Collection of the selected users
           * @type {Collection<Snowflake, GuildMember|APIGuildMember>?}
           */
          this.members = new Collection();
          for (const [id, member] of Object.entries(members)) {
            const user = users[id];
            this.members.set(id, this.guild?.members._add({ user, ...member }) ?? member);
          }
        } else {
          this.members = null;
        }

        if (users) {
          /**
           * Collection of the selected users
           * @type {Collection<Snowflake, User|APIUser>?}
           */
          this.users = new Collection();
          for (const user of Object.values(users)) {
            this.users.set(user.id, this.client.users._add(user));
          }
        } else {
          this.users = null;
        }

        if (roles) {
          /**
           * Collection of the selected roles
           * @type {Collection<Snowflake, Role|APIRole>?}
           */
          this.roles = new Collection();
          for (const role of Object.values(roles)) {
            this.roles.set(role.id, this.guild?.roles._add(role) ?? role);
          }
        } else {
          this.roles = null;
        }
      }
}
module.exports = MentionableSelectMenuInteraction;
