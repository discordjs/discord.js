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
		a.updateMessage(m, "!!!").then(function (m) {
			a.updateMessage(m, "the old content was " + m.content);
		});
	});
});

a.on("messageUpdated", function(newm, oldm){
	if(oldm){
		a.sendMessage(oldm, `woah! ${newm.author} changed their message! how rude`)
	}
})
a.on("messageDeleted", function(oldm){
	if(oldm){
		a.sendMessage(oldm, `woah! ${oldm.author} deleted their message! how rude`)
	}
})

a.login(process.env["discordEmail"], process.env["discordPass"])["catch"](function (e) {
	return console.log(e);
});