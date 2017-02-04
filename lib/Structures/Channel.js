"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Equality = require("../Util/Equality");

var _Equality2 = _interopRequireDefault(_Equality);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Channel extends _Equality2.default {
	constructor(data, client) {
		super();
		this.id = data.id;
		this.client = client;
	}

	get createdAt() {
		return new Date(+this.id / 4194304 + 1420070400000);
	}

	get isPrivate() {
		return !this.server;
	}

	delete() {
		return this.client.deleteChannel.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}
}
exports.default = Channel;
//# sourceMappingURL=Channel.js.map
