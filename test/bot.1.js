var Discord = require("../");
var mybot = new Discord.Client();
var fs = require("fs");

var server, channel, message, sentMessage = false;

counter = 1;

mybot.on("message", function (message) {
	
	console.log("Everyone mentioned? " + message.everyoneMentioned);
	if (message.content.substr(0,3) !== "$$$") {
		return;
	}

	// we can go ahead :)
	
	var user;
	if(message.mentions.length > 0){
		user = message.mentions[0];
	}else{
		user = message.sender;
	}
	
	console.log("the ID is ", user.id);
	
	mybot.reply(message, user + "'s evaluated permissions in this channel are " + JSON.stringify(message.channel.permissionsOf(user), null, 4).replace(/true/g, "**true**"));
	
});

mybot.on("ready", function () {
	console.log("im ready");
	
	for(var server of mybot.servers){
		if(server.name === "test-server"){
			mybot.leaveServer(server);
		}
	}
	
});

mybot.on("debug", function(info){
	console.log(info);
})

mybot.on("unknown", function(info){
	console.log("warning!", info);
})

mybot.on("channelUpdate", function(oldChan, newChan){
	
});

mybot.on("startTyping", function(user, channel){
	console.log("start", user);
});
mybot.on("stopTyping", function(user, channel){
	console.log("stop", user);
});

function dump(msg) {
	console.log(msg);
}

function error(err) {
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);