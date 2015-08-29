var Discord = require("../");
var mybot = new Discord.Client({
	queue : ["sendMessage"]
});

var server, channel, message, sentMessage = false;

mybot.on("message", function(message){
	
	if(message.content === "$$$"){
		for(var x=1;x<=10;x++){
			mybot.sendMessage(message.channel, "this is message " + x);	
		}
	}
	
});

function error(err){
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);