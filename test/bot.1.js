var Discord = require("../");
var mybot = new Discord.Client({
	queue: true
});
var fs = require("fs");

var server, channel, message, sentMessage = false;

mybot.on("message", function (message) {

	if (mybot.user.equals(message.sender)) {
		return;
	}

	if (message.content !== "$$$") {
		return;
	}

	// we can go ahead :)
	console.log(message.sender.username);
	mybot.sendMessage(message.channel, message.sender.username);
});

mybot.on("ready", function () {
	console.log("im ready");
})

function dump(msg) {
	console.log(msg);
}

function error(err) {
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);