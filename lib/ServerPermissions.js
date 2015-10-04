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
	}

	_createClass(ServerPermissions, [{
		key: "getBit",
		value: function getBit(x) {
			return (this.packed >>> x & 1) === 1;
		}
	}, {
		key: "setBit",
		value: function setBit() {
			//dummy function for now
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
	}, {
		key: "banMembers",
		get: function get() {
			return this.getBit(1);
		},
		set: function set(val) {
			this.setBit(1, val);
		}
	}, {
		key: "kickMembers",
		get: function get() {
			return this.getBit(2);
		},
		set: function set(val) {
			this.setBit(2, val);
		}
	}, {
		key: "manageRoles",
		get: function get() {
			return this.getBit(3);
		},
		set: function set(val) {
			this.setBit(3, val);
		}
	}, {
		key: "manageChannels",
		get: function get() {
			return this.getBit(4);
		},
		set: function set(val) {
			this.setBit(4, val);
		}
	}, {
		key: "manageServer",
		get: function get() {
			return this.getBit(5);
		},
		set: function set(val) {
			this.setBit(5, val);
		}
	}, {
		key: "readMessages",
		get: function get() {
			return this.getBit(10);
		},
		set: function set(val) {
			this.setBit(10, val);
		}
	}, {
		key: "sendMessages",
		get: function get() {
			return this.getBit(11);
		},
		set: function set(val) {
			this.setBit(11, val);
		}
	}, {
		key: "sendTTSMessages",
		get: function get() {
			return this.getBit(12);
		},
		set: function set(val) {
			this.setBit(12, val);
		}
	}, {
		key: "manageMessages",
		get: function get() {
			return this.getBit(13);
		},
		set: function set(val) {
			this.setBit(13, val);
		}
	}, {
		key: "embedLinks",
		get: function get() {
			return this.getBit(14);
		},
		set: function set(val) {
			this.setBit(14, val);
		}
	}, {
		key: "attachFiles",
		get: function get() {
			return this.getBit(15);
		},
		set: function set(val) {
			this.setBit(15, val);
		}
	}, {
		key: "readMessageHistory",
		get: function get() {
			return this.getBit(16);
		},
		set: function set(val) {
			this.setBit(16, val);
		}
	}, {
		key: "mentionEveryone",
		get: function get() {
			return this.getBit(17);
		},
		set: function set(val) {
			this.setBit(17, val);
		}
	}, {
		key: "voiceConnect",
		get: function get() {
			return this.getBit(20);
		},
		set: function set(val) {
			this.setBit(20, val);
		}
	}, {
		key: "voiceSpeak",
		get: function get() {
			return this.getBit(21);
		},
		set: function set(val) {
			this.setBit(21, val);
		}
	}, {
		key: "voiceMuteMembers",
		get: function get() {
			return this.getBit(22);
		},
		set: function set(val) {
			this.setBit(22, val);
		}
	}, {
		key: "voiceDeafenMembers",
		get: function get() {
			return this.getBit(23);
		},
		set: function set(val) {
			this.setBit(23, val);
		}
	}, {
		key: "voiceMoveMembers",
		get: function get() {
			return this.getBit(24);
		},
		set: function set(val) {
			this.setBit(24, val);
		}
	}, {
		key: "voiceUseVoiceActivation",
		get: function get() {
			return this.getBit(25);
		},
		set: function set(val) {
			this.setBit(25, val);
		}
	}]);

	return ServerPermissions;
})();

module.exports = ServerPermissions;