'use strict';

const Action = require('./Action');
const Invite = require('../../structures/Invite');
const { Events } = require('../../util/Constants');

class InviteCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    const channel = client.channels.get(data.channel_id);
    if (guild && channel) {
      const inviteData = Object.assign(data, { guild, channel });
      const invite = new Invite(client, inviteData);
      /**
       * Emitted when an invite is created.
       * <info> This event only triggers if the client has `MANAGE_GUILD` permissions for the guild,
       * or `MANAGE_CHANNEL` permissions for the channel.</info>
       * @event Client#inviteCreate
       * @param {Invite} invite The invite that was created
       */
      client.emit(Events.INVITE_CREATE, invite);
      return { invite };
    }
    return { invite: null };
  }
}

module.exports = InviteCreateAction;
