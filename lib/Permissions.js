"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Permission = (function () {
	function Permission(packedPermissions) {
		_classCallCheck(this, Permission);

		function getBit(x) {
			return (this.packed >>> x & 1) === 1;
		}

		this.packed = packedPermissions;

		this.createInstantInvite = getBit(0);
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
		this.voiceUseVoiceActivation = getBit(26);
	}

	_createClass(Permission, [{
		key: "getBit",
		value: function getBit(x) {
			return (this.packed >>> x & 1) === 1;
		}
	}]);

	return Permission;
})();