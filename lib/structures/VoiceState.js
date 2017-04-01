"use strict";

const Base = require("./Base");

/**
* Represents a member's voice state in a call/guild
* @prop {String} id The ID of the member
* @prop {String?} sessionID The ID of the member's current voice session
* @prop {String?} channelID The ID of the member's current voice channel
* @prop {Boolean} mute Whether the member is server muted or not
* @prop {Boolean} deaf Whether the member is server deafened or not
* @prop {Boolean} suppress Whether the member is suppressed or not
* @prop {Boolean} selfMute Whether the member is self muted or not
* @prop {Boolean} selfDeaf Whether the member is self deafened or not
*/
class VoiceState extends Base {
    constructor(data) {
        super(data.id);
        this.update(data);
    }

    update(data) {
        if(data.channel_id !== undefined) {
            this.channelID = data.channel_id;
            this.sessionID = data.channel_id === null ? null : data.session_id;
        } else if(this.channelID === undefined) {
            this.channelID = this.sessionID = null;
        }
        this.mute = data.mute !== undefined ? data.mute : this.mute || false;
        this.deaf = data.deaf !== undefined ? data.deaf : this.deaf || false;
        this.suppress = data.suppress !== undefined ? data.suppress : this.suppress || false; // Bots ignore this
        this.selfMute = data.self_mute !== undefined ? data.self_mute : this.selfMute || false;
        this.selfDeaf = data.self_deaf !== undefined ? data.self_deaf : this.selfDeaf || false;
    }
}

module.exports = VoiceState;