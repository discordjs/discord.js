"use strict";

module.exports = {
	Client: require("./Client/Client.js")
};

var a = new module.exports.Client();
a.on("debug", function (m) {
	return console.log("[debug]", m);
});

a.on("message", function (m) {
	if (m.content === "$$$") a.reply(m, "hi man!").then(function (m) {
		a.deleteMessage(m);
	});
});

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});