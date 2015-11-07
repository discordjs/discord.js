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
	if (m.content === "&init") {
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
				a.joinVoiceChannel(channel)["catch"](error).then(function (connection) {
					connection.playFile("C:/users/amish/desktop/asdf.mp3");
				});
				break;
			}
		}
	}
	if (m.content.startsWith("$$$ stop")) {
		for (var _iterator2 = m.channel.server.channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var channel = _ref2;

			if (channel instanceof VoiceChannel) {
				chan = channel;
				break;
			}
		}
		if (a.internal.voiceConnections[chan]) {
			var connection = a.internal.voiceConnections[chan];
			connection.stopPlaying();
		}
		return;
	}
	if (m.content.startsWith("$$$")) {
		var chan;
		for (var _iterator3 = m.channel.server.channels, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
			var _ref3;

			if (_isArray3) {
				if (_i3 >= _iterator3.length) break;
				_ref3 = _iterator3[_i3++];
			} else {
				_i3 = _iterator3.next();
				if (_i3.done) break;
				_ref3 = _i3.value;
			}

			var channel = _ref3;

			if (channel instanceof VoiceChannel) {
				chan = channel;
				break;
			}
		}
		if (a.internal.voiceConnections[chan]) {
			var connection = a.internal.voiceConnections[chan];
			connection.playFile("C:/users/amish/desktop/asdf.mp3");
		}
	}
});

function error(e) {
	console.log(e.stack);
	process.exit(0);
}

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});