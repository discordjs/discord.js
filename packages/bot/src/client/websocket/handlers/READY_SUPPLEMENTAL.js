'use strict';

const { Events } = require('../../../util/Events.js');

/**
 * Handles the READY_SUPPLEMENTAL dispatch event.
 * Merges voice states, members, and presences from supplemental data into guilds.
 * Also loads lazy private channels and friend presences.
 *
 * Reference: discord.py-self/discord/state.py parse_ready_supplemental()
 */
module.exports = (client, { d: data }) => {
  client.emit(Events.Debug, '[READY_SUPPLEMENTAL] Received supplemental data');

  // Build user lookup from cached users (already populated from READY)
  const guilds = [...client.guilds.cache.values()];

  // Merge supplemental guild data (voice_states, members, presences)
  const supplementalGuilds = data.guilds ?? [];
  const mergedMembers = data.merged_members ?? [];
  const guildPresences = data.merged_presences?.guilds ?? [];

  for (const [idx, guildExtra] of supplementalGuilds.entries()) {
    const guild = guilds[idx];
    if (!guild) continue;

    const members = mergedMembers[idx] ?? [];
    const presences = guildPresences[idx] ?? [];

    // Merge voice states
    if (guildExtra.voice_states?.length) {
      for (const voiceState of guildExtra.voice_states) {
        guild.voiceStates._add(voiceState);
      }
    }

    // Merge members (from merged_members — includes self + other members)
    for (const memberData of members) {
      // merged_members may use user_id instead of user object
      if (!memberData.user && memberData.user_id) {
        const cachedUser = client.users.cache.get(memberData.user_id);
        if (cachedUser) {
          memberData.user = {
            id: cachedUser.id,
            username: cachedUser.username,
            discriminator: cachedUser.discriminator,
          };
        } else {
          memberData.user = { id: memberData.user_id };
        }
      }

      if (memberData.user) {
        guild.members._add(memberData);
      }
    }

    // Merge presences
    for (const presence of presences) {
      // Presences may use user_id instead of user object
      if (!presence.user && presence.user_id) {
        presence.user = { id: presence.user_id };
      }

      if (presence.user) {
        guild.presences._add(Object.assign(presence, { guild }));
      }
    }
  }

  // Load lazy private channels (additional DMs not included in main READY)
  const lazyChannels = data.lazy_private_channels ?? [];
  for (const channel of lazyChannels) {
    client.channels._add(channel);
  }

  // Handle friend presences
  const friendPresences = data.merged_presences?.friends ?? [];
  for (const presence of friendPresences) {
    const userId = presence.user_id ?? presence.user?.id;
    if (userId) {
      // Store friend presence on the user if cached
      const user = client.users.cache.get(userId);
      if (user) {
        user.presence = presence;
      }
    }
  }

  client.emit(
    Events.Debug,
    `[READY_SUPPLEMENTAL] Merged: ${supplementalGuilds.length} guilds, ${lazyChannels.length} lazy channels, ${friendPresences.length} friend presences`,
  );
};
