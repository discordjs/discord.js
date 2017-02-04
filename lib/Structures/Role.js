"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Constants = require("../Constants");

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

/*

example data

{ position: -1,
    permissions: 36953089,
    name: '@everyone',
    managed: false,
    id: '110007368451915776',
    hoist: false,
    color: 0 }
*/

const DefaultRole = [_Constants.Permissions.createInstantInvite, _Constants.Permissions.readMessages, _Constants.Permissions.readMessageHistory, _Constants.Permissions.sendMessages, _Constants.Permissions.sendTTSMessages, _Constants.Permissions.embedLinks, _Constants.Permissions.attachFiles, _Constants.Permissions.readMessageHistory, _Constants.Permissions.mentionEveryone, _Constants.Permissions.voiceConnect, _Constants.Permissions.voiceSpeak, _Constants.Permissions.voiceUseVAD].reduce((previous, current) => previous | current, 0);

class Role {
	constructor(data, server, client) {
		this.position = data.position || -1;
		this.permissions = data.permissions || (data.name === "@everyone" ? DefaultRole : 0);
		this.name = data.name || "@everyone";
		this.managed = data.managed || false;
		this.id = data.id;
		this.hoist = data.hoist || false;
		this.color = data.color || 0;
		this.server = server;
		this.client = client;
		this.mentionable = data.mentionable || false;
	}

	get createdAt() {
		return new Date(+this.id / 4194304 + 1420070400000);
	}

	toObject() {
		let keys = ['id', 'position', 'permissions', 'name', 'managed', 'hoist', 'color', 'mentionable'],
		    obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		return obj;
	}

	serialise(explicit) {

		var hp = perm => this.hasPermission(perm, explicit);

		return {
			// general
			createInstantInvite: hp(_Constants.Permissions.createInstantInvite),
			kickMembers: hp(_Constants.Permissions.kickMembers),
			banMembers: hp(_Constants.Permissions.banMembers),
			manageRoles: hp(_Constants.Permissions.manageRoles),
			manageChannels: hp(_Constants.Permissions.manageChannels),
			manageServer: hp(_Constants.Permissions.manageServer),
			administrator: hp(_Constants.Permissions.administrator),
			// text
			readMessages: hp(_Constants.Permissions.readMessages),
			sendMessages: hp(_Constants.Permissions.sendMessages),
			sendTTSMessages: hp(_Constants.Permissions.sendTTSMessages),
			manageMessages: hp(_Constants.Permissions.manageMessages),
			embedLinks: hp(_Constants.Permissions.embedLinks),
			attachFiles: hp(_Constants.Permissions.attachFiles),
			readMessageHistory: hp(_Constants.Permissions.readMessageHistory),
			mentionEveryone: hp(_Constants.Permissions.mentionEveryone),
			// voice
			voiceConnect: hp(_Constants.Permissions.voiceConnect),
			voiceSpeak: hp(_Constants.Permissions.voiceSpeak),
			voiceMuteMembers: hp(_Constants.Permissions.voiceMuteMembers),
			voiceDeafenMembers: hp(_Constants.Permissions.voiceDeafenMembers),
			voiceMoveMembers: hp(_Constants.Permissions.voiceMoveMembers),
			voiceUseVAD: hp(_Constants.Permissions.voiceUseVAD)
		};
	}

	serialize() {
		// ;n;
		return this.serialise();
	}

	hasPermission(perm, explicit = false) {
		if (perm instanceof String || typeof perm === "string") {
			perm = _Constants.Permissions[perm];
		}
		if (!perm) {
			return false;
		}
		if (!explicit) {
			// implicit permissions allowed
			if (!!(this.permissions & _Constants.Permissions.administrator)) {
				// manageRoles allowed, they have all permissions
				return true;
			}
		}
		// e.g.
		// !!(36953089 & Permissions.manageRoles) = not allowed to manage roles
		// !!(36953089 & (1 << 21)) = voice speak allowed

		return !!(this.permissions & perm);
	}

	setPermission(permission, value) {
		if (permission instanceof String || typeof permission === "string") {
			permission = _Constants.Permissions[permission];
		}
		if (permission) {
			// valid permission
			if (value) {
				this.permissions |= permission;
			} else {
				this.permissions &= ~permission;
			}
		}
	}

	setPermissions(obj) {
		obj.forEach((value, permission) => {
			if (permission instanceof String || typeof permission === "string") {
				permission = _Constants.Permissions[permission];
			}
			if (permission) {
				// valid permission
				this.setPermission(permission, value);
			}
		});
	}

	colorAsHex() {
		var val = this.color.toString(16);
		while (val.length < 6) {
			val = "0" + val;
		}
		return "#" + val;
	}

	delete() {
		return this.client.deleteRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	edit() {
		return this.client.updateRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	update() {
		return this.client.updateRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	addMember(member, callback) {
		return this.client.addMemberToRole.apply(this.client, [member, this, callback]);
	}

	addUser(member, callback) {
		return this.client.addUserToRole.apply(this.client, [member, this, callback]);
	}

	removeMember(member, callback) {
		return this.client.removeMemberFromRole.apply(this.client, [member, this, callback]);
	}

	removeUser(member, callback) {
		return this.client.removeUserFromRole.apply(this.client, [member, this, callback]);
	}

	mention() {
		if (this.mentionable) return `<@&${ this.id }>`;
		return this.name;
	}

	toString() {
		return this.mention();
	}
}
exports.default = Role;
//# sourceMappingURL=Role.js.map
