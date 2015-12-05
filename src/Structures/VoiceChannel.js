"use strict";

import ServerChannel from "./ServerChannel";
import {reg} from "../Util/ArgumentRegulariser";

export default class VoiceChannel extends ServerChannel{
	constructor(data, client, server){
		super(data, client, server);
	}

	join(callback = function () { }) {
		return this.client.joinVoiceChannel.apply(this.client, [this, callback]);
	}
}
