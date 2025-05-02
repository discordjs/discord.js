'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class GuildMemberRemoveAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    let member = null;
    if (guild) {
      member = this.getMember({ user: data.user }, guild);
      guild.memberCount--;
      if (member) {
        guild.members.cache.delete(member.id);
        /**
         * Emitted whenever a member leaves a guild, or is kicked.
         *
         * @event Client#guildMemberRemove
         * @param {GuildMember} member The member that has left/been kicked from the guild
         */
        client.emit(Events.GuildMemberRemove, member);
      }

      guild.presences.cache.delete(data.user.id);
      guild.voiceStates.cache.delete(data.user.id);
    }

    return { guild, member };
  }
}

exports.GuildMemberRemoveAction = GuildMemberRemoveAction;
