"use strict";

import Equality from "../Util/Equality";
import {Endpoints} from "../Constants";
import {reg} from "../Util/ArgumentRegulariser";

export default class User extends Equality {
	constructor(data, client){
		super();
		this.client = client;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.id = data.id;
		this.avatar = data.avatar;
		this.bot = !!data.bot;
		this.status = data.status || "offline";
		this.game = data.game || null;
		this.typing = {
			since : null,
			channel : null
		};
		this.note = data.note || null;
		this.voiceChannel = null;
		this.voiceState = {};
		this.speaking = false;
	}

	get createdAt() {
		return new Date((+this.id / 4194304) + 1420070400000);
	}

	get avatarURL(){
		if(!this.avatar){
			return null;
		}else{
			return Endpoints.AVATAR(this.id, this.avatar);
		}
	}

	get name() {
		return this.username;
	}

	mention(){
		return `<@${this.id}>`;
	}

	toString(){
		return this.mention();
	}

	toObject() {
		let keys = ['id', 'username', 'discriminator', 'avatar', 'bot', 'status', 'game', 'note', 'voiceState', 'speaking'],
			obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		obj.typing = {
			since: this.typing.since,
			channelID: this.typing.channel ? this.typing.channel.id : null
		};
		obj.voiceChannelID = this.voiceChannel ? this.voiceChannel.id : null;

		return obj;
	}

	equalsStrict(obj){
		if(obj instanceof User)
			return (
				this.id === obj.id &&
				this.username === obj.username &&
				this.discriminator === obj.discriminator &&
				this.avatar === obj.avatar &&
				this.status === obj.status &&
				(this.game === obj.game || this.game && obj.game && this.game.name === obj.game.name)
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

	getMessage() {
		return this.client.getMessage.apply(this.client, reg(this, arguments));
	}

	hasRole(role) {
		return this.client.memberHasRole.apply(this.client, [this, role]);
	}
}
