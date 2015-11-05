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
		a.createRole(m.channel.server, {
			name: "a_role!",
			color: 0xFF0000,
			hoist: true,
			permissions: ["manageRoles"]
		}).then(function (role) {
			a.addMemberToRole(m.author, role).then(function () {
				a.reply(m, "added!");
			})["catch"](function (e) {
				console.log(e.stack);
			});
		})["catch"](function (e) {
			console.log(e.stack);
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