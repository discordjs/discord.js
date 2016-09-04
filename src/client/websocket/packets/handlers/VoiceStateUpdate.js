const AbstractHandler = require('./AbstractHandler');

const Constants = require('../../../../util/Constants');
const cloneObject = require('../../../../util/CloneObject');

class VoiceStateUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user_id);
      if (member) {
        const oldVoiceChannelMember = cloneObject(member);
        if (member.voiceChannel && member.voiceChannel.id !== data.channel_id) {
          member.voiceChannel.members.delete(oldVoiceChannelMember.id);
        }

        // if the member left the voice channel, unset their speaking property
        if (!data.channel_id) member.speaking = null;

        if (client.voice.pending.has(guild.id) && member.user.id === client.user.id && data.channel_id) {
          client.voice._receivedVoiceStateUpdate(data.guild_id, data.session_id);
        }

        const newChannel = client.channels.get(data.channel_id);
        if (newChannel) newChannel.members.set(member.user.id, member);

        member.serverMute = data.mute;
        member.serverDeaf = data.deaf;
        member.selfMute = data.self_mute;
        member.selfDeaf = data.self_deaf;
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
