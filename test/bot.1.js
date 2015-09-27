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
	
	mybot.startTyping(message.channel);
	
	setTimeout(function(){
		mybot.reply(message, "stopping now k");
		mybot.stopTyping(message.channel);
	}, 6000);
	
});

mybot.on("ready", function () {
	console.log("im ready");
});

mybot.on("debug", function(info){
	console.log(info);
})

mybot.on("unknown", function(info){
	console.log("warning!", info);
})

function dump(msg) {
	console.log(msg);
}

function error(err) {
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);