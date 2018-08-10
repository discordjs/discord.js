const AbstractHandler = require('./AbstractHandler');

const { Events } = require('../../../../util/Constants');

class VoiceStateUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      // Update the state
      const oldState = guild.voiceStates.get(data.user_id);
      if (oldState) oldState._patch(data);
      else guild.voiceStates.add(data);

      const member = guild.members.get(data.user_id);
      if (member) {
        if (member.user.id === client.user.id && data.channel_id) {
          client.emit('self.voiceStateUpdate', data);
        }
        client.emit(Events.VOICE_STATE_UPDATE, oldState, member.voiceState);
      }
    }
  }
}

/**
 * Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 * @event Client#voiceStateUpdate
 * @param {VoiceState} oldState The voice state before the update
 * @param {VoiceState} newState The voice state after the update
 */

module.exports = VoiceStateUpdateHandler;
