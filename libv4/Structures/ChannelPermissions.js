"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require("../Constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChannelPermissions = function () {
	function ChannelPermissions(permissions) {
		_classCallCheck(this, ChannelPermissions);

		this.permissions = permissions;
	}

	_createClass(ChannelPermissions, [{
		key: "serialise",
		value: function serialise(explicit) {
			var _this = this;

			var hp = function hp(perm) {
				return _this.hasPermission(perm, explicit);
			};

			var json = {};

			for (var permission in _Constants.Permissions) {
				json[permission] = hp(_Constants.Permissions[permission]);
			}

			return json;
		}
	}, {
		key: "serialize",
		value: function serialize() {
			// ;n;
			return this.serialise();
		}
	}, {
		key: "hasPermission",
		value: function hasPermission(perm) {
			var explicit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
	}]);

	return ChannelPermissions;
}();

exports.default = ChannelPermissions;
//# sourceMappingURL=ChannelPermissions.js.map
