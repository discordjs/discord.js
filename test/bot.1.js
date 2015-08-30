var Discord = require("../");
var mybot = new Discord.Client({
	queue : ["send"]
});
var fs = require("fs");

var server, channel, message, sentMessage = false;

mybot.on("message", function(message){
	
	if( mybot.user.equals(message.sender) ){
		return;
	}
	
	if( message.content !== "$$$" ){
		return;
	}
	
	var action1 = mybot.sendMessage(message.channel, "this is message " + 1);
	var action1 = mybot.sendFile(message.channel, fs.createReadStream("./test/image.png"));
	var action2 = mybot.sendMessage(message.channel, "this is message " + 2).then(log);
	var action1 = mybot.sendFile(message.channel, fs.createReadStream("./test/image.png"));
	var action2 = mybot.sendMessage(message.channel, "this is message " + 3).then(log);
	var action1 = mybot.sendFile(message.channel, fs.createReadStream("./test/image.png"));
	var action2 = mybot.sendMessage(message.channel, "this is message " + 4).then(log);
	var action1 = mybot.sendFile(message.channel, fs.createReadStream("./test/image.png"));
	var action2 = mybot.sendMessage(message.channel, "this is message " + 5).then(log);
	
	function log(){
	}
	
});

function error(err){
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);