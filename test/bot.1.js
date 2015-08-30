var Discord = require("../");
var mybot = new Discord.Client({
	queue : ["sendMessage"]
});

var server, channel, message, sentMessage = false;

mybot.on("message", function(message){
	
	if( mybot.user.equals(message.sender) ){
		return;
	}
	
	var action1 = mybot.sendMessage(message.channel, "this is message " + 1);
	var action2 = mybot.sendMessage(message.channel, "this is message " + 2).then(log);
	
	function log(){
		mybot.sendMessage(message.channel, action1.message ? action1.message : action1.error);
	}
	
});

function error(err){
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);