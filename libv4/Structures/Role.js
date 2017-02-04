"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require("../Constants");

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var DefaultRole = [_Constants.Permissions.createInstantInvite, _Constants.Permissions.readMessages, _Constants.Permissions.readMessageHistory, _Constants.Permissions.sendMessages, _Constants.Permissions.sendTTSMessages, _Constants.Permissions.embedLinks, _Constants.Permissions.attachFiles, _Constants.Permissions.readMessageHistory, _Constants.Permissions.mentionEveryone, _Constants.Permissions.voiceConnect, _Constants.Permissions.voiceSpeak, _Constants.Permissions.voiceUseVAD].reduce(function (previous, current) {
	return previous | current;
}, 0);

var Role = function () {
	function Role(data, server, client) {
		_classCallCheck(this, Role);

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

	_createClass(Role, [{
		key: "toObject",
		value: function toObject() {
			var keys = ['id', 'position', 'permissions', 'name', 'managed', 'hoist', 'color', 'mentionable'],
			    obj = {};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var k = _step.value;

					obj[k] = this[k];
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return obj;
		}
	}, {
		key: "serialise",
		value: function serialise(explicit) {
			var _this = this;

			var hp = function hp(perm) {
				return _this.hasPermission(perm, explicit);
			};

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
	}, {
		key: "setPermission",
		value: function setPermission(permission, value) {
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
	}, {
		key: "setPermissions",
		value: function setPermissions(obj) {
			var _this2 = this;

			obj.forEach(function (value, permission) {
				if (permission instanceof String || typeof permission === "string") {
					permission = _Constants.Permissions[permission];
				}
				if (permission) {
					// valid permission
					_this2.setPermission(permission, value);
				}
			});
		}
	}, {
		key: "colorAsHex",
		value: function colorAsHex() {
			var val = this.color.toString(16);
			while (val.length < 6) {
				val = "0" + val;
			}
			return "#" + val;
		}
	}, {
		key: "delete",
		value: function _delete() {
			return this.client.deleteRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "edit",
		value: function edit() {
			return this.client.updateRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "update",
		value: function update() {
			return this.client.updateRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "addMember",
		value: function addMember(member, callback) {
			return this.client.addMemberToRole.apply(this.client, [member, this, callback]);
		}
	}, {
		key: "addUser",
		value: function addUser(member, callback) {
			return this.client.addUserToRole.apply(this.client, [member, this, callback]);
		}
	}, {
		key: "removeMember",
		value: function removeMember(member, callback) {
			return this.client.removeMemberFromRole.apply(this.client, [member, this, callback]);
		}
	}, {
		key: "removeUser",
		value: function removeUser(member, callback) {
			return this.client.removeUserFromRole.apply(this.client, [member, this, callback]);
		}
	}, {
		key: "mention",
		value: function mention() {
			if (this.mentionable) return "<@&" + this.id + ">";
			return this.name;
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.mention();
		}
	}, {
		key: "createdAt",
		get: function get() {
			return new Date(+this.id / 4194304 + 1420070400000);
		}
	}]);

	return Role;
}();

exports.default = Role;
//# sourceMappingURL=Role.js.map
