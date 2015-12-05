"use strict";

import Equality from "../Util/Equality";
import {reg} from "../Util/ArgumentRegulariser";

export default class Channel extends Equality {

	constructor(data, client){
		super();
		this.id = data.id;
		this.client = client;
	}

	get isPrivate() {
		return !!this.server;
	}

	delete(){
		return this.client.deleteChannel.apply(this.client, reg(this, arguments));
	}
}
