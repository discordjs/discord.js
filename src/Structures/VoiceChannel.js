"use strict";

import ServerChannel from "./ServerChannel";

export default class VoiceChannel extends ServerChannel{
	constructor(data, client, server){
		super(data, client, server);
	}
}
