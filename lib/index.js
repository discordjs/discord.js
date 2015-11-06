"use strict";

module.exports = {
	Client: require("./Client/Client.js")
};

var VoiceChannel = require("./Structures/VoiceChannel.js");

var a = new module.exports.Client();
a.on("debug", function (m) {
	return console.log("[debug]", m);
});
a.on("warn", function (m) {
	return console.log("[warn]", m);
});
var start = Date.now();
a.on("message", function (m) {
	if (m.content === "$$$") {
		for (var _iterator = m.channel.server.channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var channel = _ref;

			if (channel instanceof VoiceChannel) {
				a.internal.joinVoiceChannel(channel)["catch"](error);
				break;
			}
		}
	}
});

function error(e) {
	console.log(e);
	process.exit(0);
}

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});