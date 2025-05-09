'use strict';

const { GuildInvite } = require('../../../structures/GuildInvite.js');
const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const channel = client.channels.cache.get(data.channel_id);
  const guild = client.guilds.cache.get(data.guild_id);
  if (!channel) return;

  const inviteData = Object.assign(data, { channel, guild });
  const invite = new GuildInvite(client, inviteData);

  guild.invites.cache.delete(invite.code);

  /**
   * Emitted when an invite is deleted.
   * <info>This event requires the {@link PermissionFlagsBits.ManageChannels} permission for the channel.</info>
   * @event Client#inviteDelete
   * @param {GuildInvite} invite The invite that was deleted
   */
  client.emit(Events.InviteDelete, invite);
};
