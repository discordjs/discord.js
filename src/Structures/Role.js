const Permissions = require('../util/Constants').Permissions,
      Callback    = require('../util/Callback'),
      DefaultRole = [
	      Permissions.createInstantInvite,
	      Permissions.readMessages,
	      Permissions.readMessageHistory,
	      Permissions.sendMessages,
	      Permissions.sendTTSMessages,
	      Permissions.embedLinks,
	      Permissions.attachFiles,
	      Permissions.readMessageHistory,
	      Permissions.mentionEveryone,
	      Permissions.voiceConnect,
	      Permissions.voiceSpeak,
	      Permissions.voiceUseVAD
      ].reduce((previous, current) => previous | current, 0);

class Role {
	constructor(client, server, data) {
		this.client = client;
		this.server = server;
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.id          = data.id;
		this.name        = data.name || "@everyone";
		this.color       = data.color || 0;
		this.hoist       = data.hoist || false;
		this.managed     = data.managed || false;
		this.position    = data.position || -1;
		this.permissions = data.permissions || (this.name === "@everyone" ? DefaultRole : 0 );
	}

	serialize(explicit) {
		let hp = (perm) => this.hasPermission(perm, explicit === undefined ? false : explicit);

		return {
			// general
			createInstantInvite: hp(Permissions.createInstantInvite),
			kickMembers:         hp(Permissions.kickMembers),
			banMembers:          hp(Permissions.banMembers),
			manageRoles:         hp(Permissions.manageRoles),
			manageChannels:      hp(Permissions.manageChannels),
			manageServer:        hp(Permissions.manageServer),
			// text
			readMessages:        hp(Permissions.readMessages),
			sendMessages:        hp(Permissions.sendMessages),
			sendTTSMessages:     hp(Permissions.sendTTSMessages),
			manageMessages:      hp(Permissions.manageMessages),
			embedLinks:          hp(Permissions.embedLinks),
			attachFiles:         hp(Permissions.attachFiles),
			readMessageHistory:  hp(Permissions.readMessageHistory),
			mentionEveryone:     hp(Permissions.mentionEveryone),
			// voice
			voiceConnect:        hp(Permissions.voiceConnect),
			voiceSpeak:          hp(Permissions.voiceSpeak),
			voiceMuteMembers:    hp(Permissions.voiceMuteMembers),
			voiceDeafenMembers:  hp(Permissions.voiceDeafenMembers),
			voiceMoveMembers:    hp(Permissions.voiceMoveMembers),
			voiceUseVAD:         hp(Permissions.voiceUseVAD)
		};
	}

	hasPermission(perm, explicit) {
		if (!perm) {
			return false;
		}

		if (perm instanceof String || typeof perm === "string") {
			perm = Permissions[perm];
		}

		if (explicit === undefined || !explicit) { // implicit permissions allowed
			if (!!(this.permissions & Permissions.manageRoles)) {
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
			permission = Permissions[permission];
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
				permission = Permissions[permission];
			}
			if (permission) {
				// valid permission
				this.setPermission(permission, value);
			}
		});
	}

	colorAsHex() {
		let val = this.color.toString(16);
		while (val.length < 6) {
			val = "0" + val;
		}

		return "#" + val;
	}


	delete(callback) {
		return new Promise((resolve, reject) => {
			Callback.handle(this.server.deleteRole(this.client, this), resolve, reject, callback);
		});
	}

	edit(data, callback) {
		return new Promise((resolve, reject) => {
			// Update the data inside `this`, and then hit the endpoint with the new data
		});
	}

	update(data, callback) {
		return this.edit(data, callback);
	}

	addUser(user, callback) {
		return new Promise((resolve, reject) => {
			Callback.handle(this.server.addMemberToRole(user, this), resolve, reject, callback);
		});
	}

	addMember(member, callback) {
		return this.addUser(member, callback)
	}

	removeUser(user, callback) {
		return new Promise((resolve, reject) => {
			Callback.handle(this.server.removeUserFromRole(user, this), resolve, reject, callback);
		});
	}

	removeMember(member, callback) {
		return this.removeUser(member, callback);
	}
}

module.exports = Role;
