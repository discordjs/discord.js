'use strict';

const Channel = require('./Channel');

class ServerChannel extends Channel{
	constructor(guild, data) {
		super(guild.client, data);
		this.guild = guild;
	}

	setup(data) {
		super.setup(data);
		this.type = data.type;
		this.topic = data.topic;
		this.position = data.position;
		this.permissionOverwrites = data.permission_overwrites;
		this.name = data.name;
		this.lastMessageID = data.last_message_id;
	}
}

module.exports = ServerChannel;
