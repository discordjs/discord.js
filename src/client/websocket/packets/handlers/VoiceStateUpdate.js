const AbstractHandler = require('./AbstractHandler');

const Constants = require('../../../../util/Constants');
const Util = require('../../../../util/Util');

class VoiceStateUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user_id);
      if (member) {
        const oldVoiceChannelMember = Util.cloneObject(member);
        if (member.voiceChannel && member.voiceChannel.id !== data.channel_id) {
          member.voiceChannel.members.delete(oldVoiceChannelMember.id);
        }

        // If the member left the voice channel, unset their speaking property
        if (!data.channel_id) member.speaking = null;

        if (member.user.id === client.user.id) {
          client.emit('self.voiceStateUpdate', data);
        }

        const newChannel = client.channels.get(data.channel_id);
        if (newChannel) {
          newChannel.members.set(member.id, member);
          member.guild.channels.set(data.channel_id, newChannel);
        }

        member.serverMute = data.mute;
        member.serverDeaf = data.deaf;
        member.selfMute = data.self_mute;
        member.selfDeaf = data.self_deaf;
        member.selfStream = data.self_stream || false;
        member.voiceSessionID = data.session_id;
        member.voiceChannelID = data.channel_id;
        client.emit(Constants.Events.VOICE_STATE_UPDATE, oldVoiceChannelMember, member);
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
