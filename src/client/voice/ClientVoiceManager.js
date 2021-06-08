'use strict';

/**
 * Manages voice connections for the client
 */
class ClientVoiceManager {
  constructor(client) {
    /**
     * The client that instantiated this voice manager
     * @type {Client}
     * @readonly
     * @name ClientVoiceManager#client
     */
    Object.defineProperty(this, 'client', { value: client });
  }

  onVoiceServer({ guild_id, token, endpoint }) {
    this.client.emit('debug', `[VOICE] voiceServer guild: ${guild_id} token: ${token} endpoint: ${endpoint}`);
  }

  onVoiceStateUpdate({ guild_id, session_id, channel_id }) {
    this.client.emit(
      'debug',
      `[VOICE] voiceState: guild: ${guild_id} session_id: ${session_id} channel_id: ${channel_id}`,
    );
  }
}

module.exports = ClientVoiceManager;
