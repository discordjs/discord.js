'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class InviteCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    const guild = client.guilds.cache.get(data.guild_id);
    if (!channel) return false;

    const inviteData = Object.assign(data, { channel, guild });
    const invite = guild.invites._add(inviteData);

    /**
     * Emitted when an invite is created.
     * <info>This event requires either the {@link PermissionFlagsBits.ManageGuild} permission or the
     * {@link PermissionFlagsBits.ManageChannels} permission for the channel.</info>
     * @event Client#inviteCreate
     * @param {Invite} invite The invite that was created
     */
    client.emit(Events.InviteCreate, invite);
    return { invite };
  }
}

module.exports = InviteCreateAction;
