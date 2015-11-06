"use strict";

module.exports = {
	Client: require("./Client/Client.js")
};

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
		a.internal.overwritePermissions(m.channel, m.author, {
			manageRoles: true
		})["catch"](error).then(function () {
			return console.log("hihihihihi!");
		});
	}
});
a.on("userTypingStart", function (user, chan) {
	console.log(user.username + " typing");
});
a.on("userTypingStop", function (user, chan) {
	console.log(user.username + " stopped typing");
});
a.on("ready", function () {
	for (var _iterator = a.internal.servers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var server = _ref;

		if (server.name === "craptown") {
			a.leaveServer(server);
		}
	}
});

function error(e) {
	throw e;
	process.exit(0);
}

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});