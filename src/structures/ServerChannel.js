'use strict';

const Channel = require('./Channel');
const PermissionOverwrites = require('./PermissionOverwrites');
const EvaluatedPermissions = require('./EvaluatedPermissions');
const Constants = require('../util/Constants');

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a.length !== b.length) return false;

	for (let itemInd in a) {
		let item = a[itemInd];
		let ind = b.indexOf(item);
		if (ind) {
			b.splice(ind, 1);
		}
	}

	return b.length === 0;
}

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
		this.ow = data.permission_overwrites;
		this.permissionOverwrites = [];
		if (data.permission_overwrites) {
			for (let overwrite of data.permission_overwrites) {
				this.permissionOverwrites.push(new PermissionOverwrites(this, overwrite));
			}
		}
	}

	equals(other) {
		let base = (
			this.type === other.type &&
			this.topic === other.topic &&
			this.position === other.position &&
			this.name === other.name &&
			this.id === other.id
		);

		if (base) {
			if (other.permission_overwrites) {
				let thisIDSet = this.permissionOverwrites.map(overwrite => overwrite.id);
				let otherIDSet = other.permission_overwrites.map(overwrite => overwrite.id);
				if (arraysEqual(thisIDSet, otherIDSet)) {
					base = true;
				} else {
					base = false;
				}
			} else {
				base = false;
			}
		}

		return base;
	}

	permissionsFor(member) {
		member = this.client.resolver.ResolveGuildMember(this.guild, member);
		if (member) {
			if (this.guild.owner.id === member.id) {
				return new EvaluatedPermissions(member, Constants.ALL_PERMISSIONS);
			}

			let roles = member.roles;
			let permissions = 0;
			let overwrites = this.overwritesFor(member, true);

			for (let role of roles) {
				permissions |= role.permissions;
			}

			for (let overwrite of overwrites.role.concat(overwrites.member)) {
				permissions = permissions & ~overwrite.denyData;
				permissions = permissions | overwrite.allowData;
			}

			if (!!(permissions & (Constants.PermissionFlags.MANAGE_ROLES))) {
				permissions = Constants.ALL_PERMISSIONS;
			}

			return new EvaluatedPermissions(member, permissions);
		}
	}

	overwritesFor(member, verified) {
		// for speed
		if (!verified)
			member = this.client.resolver.ResolveGuildMember(this.guild, member);
		if (member) {
			let found = [];
			let memberRoles = member._roles;

			let roleOverwrites = [];
			let memberOverwrites = [];

			for (let overwrite of this.permissionOverwrites) {
				if (overwrite.id === member.id) {
					memberOverwrites.push(overwrite);
				} else if (memberRoles.indexOf(overwrite.id) > -1) {
					roleOverwrites.push(overwrite);
				}
			}

			return {
				role: roleOverwrites,
				member: memberOverwrites,
			};
		}

		return [];
	}

	edit(data) {
		return this.client.rest.methods.UpdateChannel(this, data);
	}

	setName(name) {
		return this.client.rest.methods.UpdateChannel(this, { name, });
	}

	setPosition(position) {
		return this.rest.client.rest.methods.UpdateChannel(this, { position, });
	}

	setTopic(topic) {
		return this.rest.client.rest.methods.UpdateChannel(this, { topic, });
	}

	setBitrate() {
		return this.rest.client.rest.methods.UpdateChannel(this, { bitrate, });
	}

	toString() {
		return this.name;
	}
}

module.exports = ServerChannel;
