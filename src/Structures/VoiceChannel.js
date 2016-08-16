"use strict";

import ServerChannel from "./ServerChannel";
import Cache from "../Util/Cache";
import {reg} from "../Util/ArgumentRegulariser";

export default class VoiceChannel extends ServerChannel{
	constructor(data, client, server){
		super(data, client, server);
		this.members = data.members || new Cache();
		this.userLimit = data.user_limit || 0;
		this._bitrate = data.bitrate || 64000; // incase somebody wants to access the bps value???
		this.bitrate = Math.round(this._bitrate / 1000); // store as kbps
	}

	toObject() {
		let obj = super.toObject();
		
		obj.userLimit = this.userLimit;
		obj.bitrate = this.bitrate;
		obj.members = this.members.map(member => member.toObject());

		return obj;
	}

	join(callback = function () { }) {
		return this.client.joinVoiceChannel.apply(this.client, [this, callback]);
	}

	setUserLimit() {
		return this.client.setChannelUserLimit.apply(this.client, reg(this, arguments));
	}

	setBitrate() {
		return this.client.setChannelBitrate.apply(this.client, reg(this, arguments));
	}
}
