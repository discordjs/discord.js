"use strict";

import Equality from "../Util/Equality";
import {Endpoints} from "../Constants";
import {reg} from "../Util/ArgumentRegulariser";

export default class User extends Equality{
	constructor(data, client){
		super();
		this.client = client;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.id = data.id;
		this.avatar = data.avatar;
		this.status = data.status || "offline";
		this.gameID = data.game_id || null;
		this.typing = {
			since : null,
			channel : null
		};
	}

	get avatarURL(){
		if(!this.avatar){
			return null;
		}else{
			return Endpoints.AVATAR(this.id, this.avatar);
		}
	}

	mention(){
		return `<@${this.id}>`;
	}

	toString(){
		return this.mention();
	}

	equalsStrict(obj){
		if(obj instanceof User)
			return (
				this.id === obj.id &&
				this.username === obj.username &&
				this.discriminator === obj.discriminator &&
				this.avatar === obj.avatar &&
				this.status === obj.status &&
				this.gameID === obj.gameID
			);
		else
			return false;
	}

	equals(obj){
		if(obj instanceof User)
			return (
				this.id === obj.id &&
				this.username === obj.username &&
				this.discriminator === obj.discriminator &&
				this.avatar === obj.avatar
			);
		else
			return false;
	}

	sendMessage(){
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}

	send() {
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}

	sendTTSMessage(){
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}

	sendTTS() {
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}

	sendFile() {
		return this.client.sendFile.apply(this.client, reg(this, arguments));
	}

	startTyping() {
		return this.client.startTyping.apply(this.client, reg(this, arguments));
	}

	stopTyping() {
		return this.client.stopTyping.apply(this.client, reg(this, arguments));
	}

	addTo(role, callback) {
		return this.client.addMemberToRole.apply(this.client, [this, role, callback]);
	}

	removeFrom(role, callback) {
		return this.client.removeMemberFromRole.apply(this.client, [this, role, callback]);
	}

	getLogs() {
		return this.client.getChannelLogs.apply(this.client, reg(this, arguments));
	}
}
