'use strict';

const { ClientApplication } = require('../../../structures/ClientApplication.js');
const { Status } = require('../../../util/Status.js');

let ClientUser;

// Opcodes not in discord-api-types (user account specific)
const OP_DM_UPDATE = 13;
const OP_GUILD_SUBSCRIPTIONS_BULK = 37;

module.exports = (client, { d: data }, shardId) => {
  // Patch or create ClientUser
  if (client.user) {
    client.user._patch(data.user);
  } else {
    ClientUser ??= require('../../../structures/ClientUser.js').ClientUser;
    client.user = new ClientUser(client, data.user);
    client.users.cache.set(client.user.id, client.user);
  }

  // Load private channels (DMs)
  if (data.private_channels) {
    for (const privateChannel of data.private_channels) {
      client.channels._add(privateChannel);
    }
  }

  // Add guilds to expected set
  for (const guild of data.guilds) {
    client.expectedGuilds.add(guild.id);
    guild.shardId = shardId;
    client.guilds._add(guild);
  }

  // Patch application if present (may not exist in user READY)
  if (data.application) {
    if (client.application) {
      client.application._patch(data.application);
    } else {
      client.application = new ClientApplication(client, data.application);
    }
  }

  // Load user notes
  if (data.notes) {
    client.notes._reload(data.notes);
  }

  // Load relationships (friends, blocked, pending)
  if (data.relationships) {
    client.relationships._setup(data.relationships);
  }

  // Load client user settings
  if (data.user_settings) {
    client.settings._patch(data.user_settings);
  }

  // Load per-guild notification settings
  const guildSettings = Array.isArray(data.user_guild_settings) ? data.user_guild_settings : [];
  for (const gSetting of guildSettings) {
    const guild = client.guilds.cache.get(gSetting.guild_id);
    if (guild) guild.settings._patch(gSetting);
  }

  // Store session hash
  if (data.auth_session_id_hash) {
    client.sessionIdHash = data.auth_session_id_hash;
  }

  // Send GUILD_SUBSCRIPTIONS_BULK to enable typing/presence/member events
  if (data.guilds.length) {
    const buildSubscription = guilds =>
      guilds.reduce((acc, guild) => {
        acc[guild.id] = {
          typing: true,
          threads: true,
          activities: true,
          member_updates: true,
          thread_member_lists: [],
          members: [],
          channels: {},
        };
        return acc;
      }, {});

    const sendBulkSub = guilds =>
      // eslint-disable-next-line id-length
      client._broadcast({ op: OP_GUILD_SUBSCRIPTIONS_BULK, d: { subscriptions: buildSubscription(guilds) } });

    if (data.guilds.length > 80) {
      // Split into two batches to stay under payload size limits
      const mid = Math.floor(data.guilds.length / 2);
      sendBulkSub(data.guilds.slice(0, mid));
      sendBulkSub(data.guilds.slice(mid));
    } else {
      sendBulkSub(data.guilds);
    }
  }

  // Send DM_UPDATE for each private channel to sync DM features
  if (data.private_channels) {
    for (const channel of data.private_channels) {
      // eslint-disable-next-line id-length
      client._broadcast({ op: OP_DM_UPDATE, d: { channel_id: channel.id } });
    }
  }

  client.status = Status.WaitingForGuilds;
};
