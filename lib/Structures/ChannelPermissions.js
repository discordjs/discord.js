"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Constants = require("../Constants");

class ChannelPermissions {
	constructor(permissions) {
		this.permissions = permissions;
	}

	serialise(explicit) {

		var hp = perm => this.hasPermission(perm, explicit);

		var json = {};

		for (var permission in _Constants.Permissions) {
			json[permission] = hp(_Constants.Permissions[permission]);
		}

		return json;
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
			if (!!(this.permissions & _Constants.Permissions.manageRoles)) {
				// manageRoles allowed, they have all permissions
				return true;
			}
		}
		return !!(this.permissions & perm);
	}
}
exports.default = ChannelPermissions;
//# sourceMappingURL=ChannelPermissions.js.map
