const AbstractHandler = require('./AbstractHandler');

const { Events } = require('../../../../util/Constants');

class VoiceStateUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user_id);
      if (member) {
        const oldMember = member._clone();
        oldMember._frozenVoiceState = oldMember.voiceState;

        if (member.user.id === client.user.id && data.channel_id) {
          client.emit('self.voiceStateUpdate', data);
        }

        guild.voiceStates.set(member.user.id, data);

        client.emit(Events.VOICE_STATE_UPDATE, oldMember, member);
      }
    }
  }
}

/**
 * Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 * @event Client#voiceStateUpdate
 * @param {GuildMember} oldMember The member before the voice state update
 * @param {GuildMember} newMember The member after the voice state update
 */

module.exports = VoiceStateUpdateHandler;
