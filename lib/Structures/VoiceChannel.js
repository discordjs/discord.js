"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ServerChannel = require("./ServerChannel");

var _ServerChannel2 = _interopRequireDefault(_ServerChannel);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class VoiceChannel extends _ServerChannel2.default {
	constructor(data, client, server) {
		super(data, client, server);
		this.members = data.members || new _Cache2.default();
		this.userLimit = data.user_limit || 0;
		this._bitrate = data.bitrate || 64000; // incase somebody wants to access the bps value???
		this.bitrate = Math.round(this._bitrate / 1000); // store as kbps
	}

	toObject() {
		let obj = super.toObject();

		obj.userLimit = this.userLimit;
		obj.bitrate = this.bitrate;
		obj.members = this.members.map(member => member.toObject());

		return obj;
	}

	join(callback = function () {}) {
		return this.client.joinVoiceChannel.apply(this.client, [this, callback]);
	}

	setUserLimit() {
		return this.client.setChannelUserLimit.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	setBitrate() {
		return this.client.setChannelBitrate.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}
}
exports.default = VoiceChannel;
//# sourceMappingURL=VoiceChannel.js.map
