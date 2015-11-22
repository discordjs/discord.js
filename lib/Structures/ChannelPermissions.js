"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Permissions = require("../Constants.js").Permissions;

var ChannelPermissions = (function () {
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

			return {
				// general
				createInstantInvite: hp(Permissions.createInstantInvite),
				kickMembers: hp(Permissions.kickMembers),
				banMembers: hp(Permissions.banMembers),
				managePermissions: hp(Permissions.managePermissions),
				manageChannel: hp(Permissions.manageChannel),
				manageServer: hp(Permissions.manageServer),
				// text
				readMessages: hp(Permissions.readMessages),
				sendMessages: hp(Permissions.sendMessages),
				sendTTSMessages: hp(Permissions.sendTTSMessages),
				manageMessages: hp(Permissions.manageMessages),
				embedLinks: hp(Permissions.embedLinks),
				attachFiles: hp(Permissions.attachFiles),
				readMessageHistory: hp(Permissions.readMessageHistory),
				mentionEveryone: hp(Permissions.mentionEveryone),
				// voice
				voiceConnect: hp(Permissions.voiceConnect),
				voiceSpeak: hp(Permissions.voiceSpeak),
				voiceMuteMembers: hp(Permissions.voiceMuteMembers),
				voiceDeafenMembers: hp(Permissions.voiceDeafenMembers),
				voiceMoveMembers: hp(Permissions.voiceMoveMembers),
				voiceUseVAD: hp(Permissions.voiceUseVAD)
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
			var explicit = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			if (perm instanceof String || typeof perm === "string") {
				perm = Permissions[perm];
			}
			if (!perm) {
				return false;
			}
			if (!explicit) {
				// implicit permissions allowed
				if (!!(this.permissions & Permissions.manageRoles)) {
					// manageRoles allowed, they have all permissions
					return true;
				}
			}
			return !!(this.permissions & perm);
		}
	}]);

	return ChannelPermissions;
})();

module.exports = ChannelPermissions;