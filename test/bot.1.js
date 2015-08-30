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
		mybot.updateMessage(action1.message, "blurg");
		mybot.sendMessage(message.channel, "This is message 3 million minus the million so basically just 3");
		mybot.deleteMessage(action1.message);
		mybot.sendMessage(message.channel, "This is message RJNGEIKGNER").then(log2);
	}
});

function dump(msg) {
	console.log(msg);
}

function error(err) {
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);