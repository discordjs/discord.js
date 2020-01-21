const Action = require('./Action');
const Invite = require('../../structures/Invite');
const { Events } = require('../../util/Constants');

class InviteDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    const channel = client.channels.get(data.channel_id);
    if (guild && channel) {
      const inviteData = Object.assign(data, { guild, channel });
      const invite = new Invite(client, inviteData);
      /**
       * Emitted when an invite is deleted.
       * <info> This event only triggers if the client has `MANAGE_GUILD` permissions for the guild,
       *  or `MANAGE_CHANNEL` permissions for the channel.</info>
       * @event Client#inviteDelete
       * @param {Invite} invite The invite that was deleted
       */
      client.emit(Events.INVITE_DELETE, invite);
    }
  }
}

module.exports = InviteDeleteAction;
