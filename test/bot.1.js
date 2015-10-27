var Discord = require("../");
var Member = require("../lib/Member.js");
var mybot = new Discord.Client({
	compress : true
});
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

	mybot.reply(message, "this is tts", {tts:true}).catch(error);
	
});

mybot.once("ready", function () {
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
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);