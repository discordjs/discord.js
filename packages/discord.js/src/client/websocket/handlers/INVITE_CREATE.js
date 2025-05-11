'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const channel = client.channels.cache.get(data.channel_id);
  const guild = client.guilds.cache.get(data.guild_id);
  if (!channel) return;

  const inviteData = Object.assign(data, { channel, guild });
  const invite = guild.invites._add(inviteData);

  /**
   * Emitted when an invite is created.
   * <info>This event requires the {@link PermissionFlagsBits.ManageChannels} permission for the channel.</info>
   * @event Client#inviteCreate
   * @param {GuildInvite} invite The invite that was created
   */
  client.emit(Events.InviteCreate, invite);
};
