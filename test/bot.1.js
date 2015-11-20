var Discord = require("../");
var Member = require("../lib/Member.js");
var mybot = new Discord.Client({
	compress : true,
	catchup : "all"
});
var fs = require("fs");
var request = require("request").defaults({ encoding: null });

Discord.patchStrings();

var server, channel, message, sentMessage = false;

mybot.on("message", function (message) {

	console.log("Everyone mentioned? " + doned);
	doned++;
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

	mybot.reply(message, "Hello! It has been " + ((Date.now() - message.timestamp) - this.timeoffset) + "ms since you sent that.");
});

var doned = 0;

mybot.once("ready", function () {
	console.log("im ready");

	for (var server of mybot.servers) {
		if (server.name === "test-server") {
			mybot.leaveServer(server);
		}
	}

});

mybot.on("messageUpdate", function(newMessage, oldMessage){
	mybot.reply(newMessage, JSON.stringify(newMessage.embeds));
})

mybot.on("serverUpdate", function (oldserver, newserver) {
	console.log("server changed! " + mybot.servers.length);
})


mybot.on("channelUpdate", function (oldChan, newChan) {

});


function dump(msg) {
	console.log("dump", msg);
}

function error(err) {
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);