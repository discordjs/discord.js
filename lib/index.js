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
	if (m.content === "$$$") a.reply(m, "you have the roles:\n" + m.channel.server.rolesOfUser(m.author).map(function (v) {
		return "**" + v.name + "**   " + v.id + "\n";
	}));
	if (m.content === "$$") a.reply(m, JSON.stringify(m.channel.permissionsOf(m.author).serialise(), null, 4).replace(/true/g, "**true**"));
});
a.on("serverMemberRemoved", function (r, s) {
	console.log(r, s);
});

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});