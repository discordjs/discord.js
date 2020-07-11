/* eslint-disable max-depth */
'use strict';

const Action = require('./Action');

class GuildChannelsPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.cache.get(data.guild_id);
    if (guild) {
      for (const partialChannel of data.channels) {
        const channel = guild.channels.cache.get(partialChannel.id);
        if (channel) {
          const { position, parent_id, lock_permissions } = partialChannel;
          if (position) {
            channel.rawPosition = position;
          }
          if (parent_id) {
            const newParent = guild.channels.cache.get(parent_id);
            if (newParent) {
              channel.parentID = parent_id;
            }
          }
          if (lock_permissions) {
            const newParent = guild.channels.cache.get(parent_id);
            if (newParent) {
              channel.permissionOverwrites = newParent.permissionOverwrites.clone();
            } else if (channel.parent) {
              channel.permissionOverwrites = channel.parent.permissionOverwrites.clone();
            }
          }
        }
      }
    }

    return { guild };
  }
}

module.exports = GuildChannelsPositionUpdate;
