"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServerPermissions = (function () {
	function ServerPermissions(data) {
		_classCallCheck(this, ServerPermissions);

		var self = this;

		function getBit(x) {
			return (self.packed >>> x & 1) === 1;
		}

		this.packed = data.permissions;
		this.name = data.name;
		this.id = data.id;

		this.banMembers = getBit(1);
		this.kickMembers = getBit(2);
		this.manageRoles = getBit(3);
		this.manageChannels = getBit(4);
		this.manageServer = getBit(5);
		this.readMessages = getBit(10);
		this.sendMessages = getBit(11);
		this.sendTTSMessages = getBit(12);
		this.manageMessages = getBit(13);
		this.embedLinks = getBit(14);
		this.attachFiles = getBit(15);
		this.readMessageHistory = getBit(16);
		this.mentionEveryone = getBit(17);

		this.voiceConnect = getBit(20);
		this.voiceSpeak = getBit(21);
		this.voiceMuteMembers = getBit(22);
		this.voiceDeafenMembers = getBit(23);
		this.voiceMoveMembers = getBit(24);
		this.voiceUseVoiceActivation = getBit(25);
	}

	_createClass(ServerPermissions, [{
		key: "getBit",
		value: function getBit(x) {
			return (this.packed >>> x & 1) === 1;
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.name;
		}
	}, {
		key: "createInstantInvite",
		get: function get() {
			return this.getBit(0);
		},
		set: function set(val) {
			this.setBit(0, val);
		}
	}]);

	return ServerPermissions;
})();

module.exports = ServerPermissions;