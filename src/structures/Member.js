'use strict';

class Member {
	constructor(guild, data) {
		this.client = guild.client;
		this.guild = guild;
		this._user = {};
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this._user = data.user;
		this.deaf = data.deaf;
		this.mute = data.mute;
		this.joinDate = new Date(data.joined_at);
		this.roles = data.roles;
	}

	get username() {
		return this._user.username;
	}

	get id() {
		return this._user.id;
	}

	get discriminator() {
		return this._user.discriminator;
	}

	get avatar() {
		return this._user.avatar;
	}

	get bot() {
		return this._user.bot;
	}
}

module.exports = Member;
