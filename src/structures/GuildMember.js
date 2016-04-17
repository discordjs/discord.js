'use strict';

class GuildMember {
	constructor(guild, data) {
		this.client = guild.client;
		this.guild = guild;
		this.user = {};
		this._roles = [];
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.user = data.user;
		this.deaf = data.deaf;
		this.mute = data.mute;
		this.joinDate = new Date(data.joined_at);
		this._roles = data.roles;
	}

	get roles() {
		let list = [];
		for (let roleID of this._roles) {
			let role = this.guild.store.get('roles', roleID);
			if (role) {
				list.push(role);
			}
		}

		return list;
	}

	get id() {
		return this.user.id;
	}
}

module.exports = GuildMember;
