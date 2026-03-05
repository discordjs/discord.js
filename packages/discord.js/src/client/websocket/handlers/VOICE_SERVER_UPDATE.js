'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  client.emit(
    Events.Debug,
    `[VOICE] received voice server: ${JSON.stringify({ ...data, token: '*'.repeat(data.token.length) })}`,
  );

  client.voice.onVoiceServer(data);

  /**
   * Represents the properties of a voice server update
   *
   * @typedef {Object} VoiceServerUpdateData
   * @property {Snowflake} guildId The id of the guild this voice server update is for
   * @property {?string} endpoint The voice server host
   * @property {string} token The voice connection token
   */

  /**
   * Emitted whenever a voice server is updated.
   *
   * @event Client#voiceServerUpdate
   * @param {VoiceServerUpdateData} data The voice server update data
   */
  client.emit(Events.VoiceServerUpdate, {
    guildId: data.guild_id,
    endpoint: data.endpoint,
    token: data.token,
  });
};
