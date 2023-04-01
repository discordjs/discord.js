'use strict';

const Action = require('./Action');
const VoiceChannelEffect = require('../../../structures/VoiceChannelEffect');
const Events = require('../../../util/Events');

class VoiceChannelEffectSendAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    if (!guild) return;
    /**
     * Emmited when someone sends an effect, such as an emoji reaction,
     * in a voice channel the current user is connected to.
     * @event Client#voiceChannelEffectSend
     * @param {VoiceChannelEffect} voiceChannelEffect The sent voice channel effect
     */
    client.emit(Events.VOICE_CHANNEL_EFFECT_SEND, new VoiceChannelEffect(data, guild););
  }
}

module.exports = VoiceChannelEffectSendAction;
