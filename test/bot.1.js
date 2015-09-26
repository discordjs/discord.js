var Discord = require("../");
var mybot = new Discord.Client();
var fs = require("fs");

var server, channel, message, sentMessage = false;

mybot.on("message", function (message) {
	
	console.log("Everyone mentioned? " + message.everyoneMentioned);
	if (mybot.user.equals(message.sender)) {
		return;
	}

	if (message.content !== "$$$") {
		return;
	}

	// we can go ahead :)
	
	var onlineUsers = 0;
	
	mybot.setStatusIdle();
	
	mybot.reply(message, onlineUsers);
	
	setTimeout(function(){
		mybot.setStatusOnline();
	},5000);
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