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
	if (m.content === "$$$") a.internal.createServer("H a h").then(function (srv) {
		console.log(srv);
		a.reply(m, srv);
	});
});
a.on("serverRoleCreated", function (r, s) {
	console.log(r);
});

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});