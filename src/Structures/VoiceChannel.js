"use strict";

import ServerChannel from "./ServerChannel";
import Cache from "../Util/Cache";
import {reg} from "../Util/ArgumentRegulariser";

export default class VoiceChannel extends ServerChannel{
	constructor(data, client, server){
		super(data, client, server);
		this.members = new Cache();
	}

	join(callback = function () { }) {
		return this.client.joinVoiceChannel.apply(this.client, [this, callback]);
	}
}
