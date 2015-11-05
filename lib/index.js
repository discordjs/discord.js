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

a.on("message", function (m) {
	if (m.content === "$$$") {
		a.createInvite(m.channel).then(function (invite) {
			return a.reply(m, invite);
		})["catch"](function (e) {
			return console.log(e.stack);
		});
	}
});
a.on("userTypingStart", function (user, chan) {
	console.log(user.username + " typing");
});
a.on("userTypingStop", function (user, chan) {
	console.log(user.username + " stopped typing");
});

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});