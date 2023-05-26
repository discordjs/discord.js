'use strict';

const Action = require('./Action');
const Invite = require('../../structures/Invite');
const Events = require('../../util/Events');

class InviteDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    const guild = client.guilds.cache.get(data.guild_id);
    if (!channel) return false;

    const inviteData = Object.assign(data, { channel, guild });
    const invite = new Invite(client, inviteData);
    guild.invites.cache.delete(invite.code);

    /**
     * Emitted when an invite is deleted.
     * <info>This event requires the {@link PermissionFlagsBits.ManageChannels} permission for the channel.</info>
     * @event Client#inviteDelete
     * @param {Invite} invite The invite that was deleted
     */
    client.emit(Events.InviteDelete, invite);
    return { invite };
  }
}

module.exports = InviteDeleteAction;
