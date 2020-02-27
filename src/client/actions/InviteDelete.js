'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const Invite = require('../../structures/Invite');

class InviteDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    const guild = client.guilds.cache.get(data.guild_id);
    if (!channel && !guild) return false;

    const inviteData = Object.assign(data, { channel, guild });
    const invite = new Invite(client, inviteData);

    /**
     * Emitted when an invite is deleted.
     * <info> This event only triggers if the client has `MANAGE_GUILD` permissions for the guild,
     * or `MANAGE_CHANNEL` permissions for the channel.</info>
     * @event Client#inviteDelete
     * @param {Invite} invite The invite that was deleted
     */
    client.emit(Events.INVITE_DELETE, invite);
    return { invite };
  }
}

module.exports = InviteDeleteAction;
