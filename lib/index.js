"use strict";

module.exports = {
	Client: require("./Client/Client.js")
};

var a = new module.exports.Client();
a.on("debug", function (m) {
	return console.log("[debug]", m);
});

a.on("message", function (m) {
	if (m.content === "$$$") a.getChannelLogs(m).then(function (logs) {
		for (var _iterator = logs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var item = _ref;

			console.log(item.author.username + "> " + item.content);
		}
	});
});

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});