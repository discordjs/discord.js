"use strict";

import ServerChannel from "./ServerChannel";
import Cache from "../Util/Cache";
import {reg} from "../Util/ArgumentRegulariser";

export default class VoiceChannel extends ServerChannel{
	constructor(data, client, server){
		super(data, client, server);
		this.members = data.members || new Cache();
		this.userLimit = data.user_limit || 0;
		this.bitrate = data.bitrate ? Math.round(data.bitrate / 1000) : 64; // store as kbps
	}

	join(callback = function () { }) {
		return this.client.joinVoiceChannel.apply(this.client, [this, callback]);
	}

	setUserLimit() {
		return this.client.setChannelUserLimit.apply(this.client, [this, arguments]);
	}

	setBitrate() {
		return this.client.setChannelBitrate.apply(this.client, reg(this, arguments));
	}
}
