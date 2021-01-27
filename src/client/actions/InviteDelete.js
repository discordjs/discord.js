'use strict';

const Action = require('./Action');
const Invite = require('../../structures/Invite');
const { Events } = require('../../util/Constants');

class InviteDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    const server = client.servers.cache.get(data.server_id);
    if (!channel && !server) return false;

    const inviteData = Object.assign(data, { channel, server });
    const invite = new Invite(client, inviteData);

    /**
     * Emitted when an invite is deleted.
     * <info> This event only triggers if the client has `MANAGE_GUILD` permissions for the server,
     * or `MANAGE_CHANNEL` permissions for the channel.</info>
     * @event Client#inviteDelete
     * @param {Invite} invite The invite that was deleted
     */
    client.emit(Events.INVITE_DELETE, invite);
    return { invite };
  }
}

module.exports = InviteDeleteAction;
