var Discord = require("../");
var mybot = new Discord.Client({
	queue: ["send"]
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

	var action1 = mybot.sendMessage(message.channel, "this is message " + 1);
	var action2 = mybot.sendMessage(message.channel, "this is message " + 2).then(log);

	function log() {
		console.log("w", action1.message);
		mybot.updateMessage(action1.message, "blurg");
		mybot.sendMessage(message.channel, "This is message 3 million minus the million so basically just 3");
	}

});

function dump(msg) {
	console.log(msg);
}

function error(err) {
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);