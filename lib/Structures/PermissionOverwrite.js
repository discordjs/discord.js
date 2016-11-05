"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Constants = require("../Constants");

class PermissionOverwrite {

	constructor(data) {
		this.id = data.id;
		this.type = data.type; // member or role
		this.deny = data.deny;
		this.allow = data.allow;
	}

	// returns an array of allowed permissions
	get allowed() {
		var allowed = [];
		for (var permName in _Constants.Permissions) {
			if (permName === "manageRoles" || permName === "manageChannels") {
				// these permissions do not exist in overwrites.
				continue;
			}

			if (!!(this.allow & _Constants.Permissions[permName])) {
				allowed.push(permName);
			}
		}
		return allowed;
	}

	// returns an array of denied permissions
	get denied() {
		var denied = [];
		for (var permName in _Constants.Permissions) {
			if (permName === "manageRoles" || permName === "manageChannels") {
				// these permissions do not exist in overwrites.
				continue;
			}

			if (!!(this.deny & _Constants.Permissions[permName])) {
				denied.push(permName);
			}
		}
		return denied;
	}

	toObject() {
		let keys = ['id', 'type', 'allow', 'deny'],
		    obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		return obj;
	}

	setAllowed(allowedArray) {
		allowedArray.forEach(permission => {
			if (permission instanceof String || typeof permission === "string") {
				permission = _Constants.Permissions[permission];
			}
			if (permission) {
				this.allow |= 1 << permission;
			}
		});
	}

	setDenied(deniedArray) {
		deniedArray.forEach(permission => {
			if (permission instanceof String || typeof permission === "string") {
				permission = _Constants.Permissions[permission];
			}
			if (permission) {
				this.deny |= 1 << permission;
			}
		});
	}
}
exports.default = PermissionOverwrite;
//# sourceMappingURL=PermissionOverwrite.js.map
