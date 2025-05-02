'use strict';

const { VoiceState } = require('../../../structures/VoiceState.js');
const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  // Update the state
  const oldState =
    guild.voiceStates.cache.get(data.user_id)?._clone() ?? new VoiceState(guild, { user_id: data.user_id });

  const newState = guild.voiceStates._add(data);

  // Get the member
  let member = guild.members.cache.get(data.user_id);
  if (member && data.member) {
    member._patch(data.member);
  } else if (data.member?.user && data.member.joined_at) {
    member = guild.members._add(data.member);
  }

  // Emit event
  if (member?.user.id === client.user.id) {
    client.emit('debug', `[VOICE] received voice state update: ${JSON.stringify(data)}`);
    client.voice.onVoiceStateUpdate(data);
  }

  /**
   * Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
   *
   * @event Client#voiceStateUpdate
   * @param {VoiceState} oldState The voice state before the update
   * @param {VoiceState} newState The voice state after the update
   */
  client.emit(Events.VoiceStateUpdate, oldState, newState);
};
