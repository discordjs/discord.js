'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const VoiceState = require('../../structures/VoiceState');

class VoiceStateUpdate extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      // Update the state
      const oldState = guild.voiceStates.has(data.user_id) ?
        guild.voiceStates.get(data.user_id)._clone() :
        new VoiceState(guild, { user_id: data.user_id });

      const newState = guild.voiceStates.add(data);

      // Get the member
      let member = guild.members.get(data.user_id);
      if (member && data.member) {
        member._patch(data.member);
      } else if (data.member && data.member.user && data.member.joined_at) {
        member = guild.members.add(data.member);
      }

      // Emit event
      if (member && member.user.id === client.user.id && data.channel_id) {
        client.emit('debug', `[VOICE] received voice state update: ${JSON.stringify(data)}`);
        client.voice.onVoiceStateUpdate(data);
      }

      /**
       * Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
       * @event Client#voiceStateUpdate
       * @param {?VoiceState} oldState The voice state before the update
       * @param {VoiceState} newState The voice state after the update
       */
      client.emit(Events.VOICE_STATE_UPDATE, oldState, newState);
    }
  }
}


module.exports = VoiceStateUpdate;
