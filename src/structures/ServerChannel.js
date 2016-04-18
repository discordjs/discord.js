'use strict';

const Channel = require('./Channel');
const PermissionOverwrites = require('./PermissionOverwrites');

class ServerChannel extends Channel{
	constructor(guild, data) {
		super(guild.client, data, guild);
	}

	setup(data) {
		super.setup(data);
		this.type = data.type;
		this.topic = data.topic;
		this.position = data.position;
		this.name = data.name;
		this.lastMessageID = data.last_message_id;

		if (data.permission_overwrites) {
			this.permissionOverwrites = [];
			for (let overwrite of data.permission_overwrites) {
				this.permissionOverwrites.push(new PermissionOverwrites(this, overwrite));
			}
		}
	}

	toString() {
		return this.name;
	}
}

module.exports = ServerChannel;
