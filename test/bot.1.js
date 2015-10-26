var Discord = require("../");
var mybot = new Discord.Client();
var fs = require("fs");
var request = require("request").defaults({ encoding: null });

Discord.patchStrings();

var server, channel, message, sentMessage = false;

counter = 1;

mybot.on("message", function (message) {

	console.log("Everyone mentioned? " + message.everyoneMentioned);
	if (message.content.substr(0, 3) !== "$$$") {
		return;
	}

	// we can go ahead :)
	
	var user;
	if (message.mentions.length > 0) {
		user = message.mentions[0];
	} else {
		user = message.sender;
	}

	console.log(mybot.getUser("username", "meew0"));

	var perms = JSON.stringify(message.channel.permissionsOf(user).serialise(), null, 4);
	perms = JSON.parse(perms);

	mybot.createRole(message.channel.server, {
		color : Discord.Colors.GREEN
	}).then((perm) => {
		mybot.addMemberToRole(message.channel.server, perm, message.sender).then(console.log).catch(error);
	}).catch(error);

});

mybot.on("ready", function () {
	console.log("im ready");

	for (var server of mybot.servers) {
		if (server.name === "test-server") {
			mybot.leaveServer(server);
		}
	}

});

mybot.on("debug", function (info) {

})

mybot.on("unknown", function (info) {
	console.log("warning!", info);
})

mybot.on("channelUpdate", function (oldChan, newChan) {

});


function dump(msg) {
	console.log("dump", msg);
}

function error(err) {
	console.log("error", err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);