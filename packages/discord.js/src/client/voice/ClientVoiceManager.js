'use strict';

const { WebSocketShardEvents, CloseCodes } = require('@discordjs/ws');

/**
 * Manages voice connections for the client
 */
class ClientVoiceManager {
  constructor(client) {
    /**
     * The client that instantiated this voice manager
     *
     * @type {Client}
     * @readonly
     * @name ClientVoiceManager#client
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * Maps guild ids to voice adapters created for use with `@discordjs/voice`.
     *
     * @type {Map<Snowflake, Object>}
     */
    this.adapters = new Map();

    client.ws.on(WebSocketShardEvents.Closed, (code, shardId) => {
      if (code === CloseCodes.Normal) {
        for (const [guildId, adapter] of this.adapters.entries()) {
          if (client.guilds.cache.get(guildId)?.shardId === shardId) {
            adapter.destroy();
          }
        }
      }
    });
  }

  onVoiceServer(payload) {
    this.adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
  }

  onVoiceStateUpdate(payload) {
    if (payload.guild_id && payload.session_id && payload.user_id === this.client.user?.id) {
      this.adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
    }
  }
}

exports.ClientVoiceManager = ClientVoiceManager;
