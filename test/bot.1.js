var Discord = require("../");
var mybot = new Discord.Client({
	queue : true
});

var server, channel, message, sentMessage = false;

mybot.on("message", function(message){
	
	if(message.content === "$$$"){
		mybot.sendMessage(message.channel, "this is part 1");
		mybot.sendMessage(message.channel, "this is part 2");
		mybot.sendMessage(message.channel, "this is part 3");
		mybot.sendMessage(message.channel, "this is part 4");
		mybot.sendMessage(message.channel, "this is part 5");
		mybot.sendMessage(message.channel, "this is part 6");
		mybot.sendMessage(message.channel, "this is part 7");
		mybot.sendMessage(message.channel, "this is part 8");
	}
	
});

function error(err){
	console.log(err);
}

mybot.login(process.env["ds_email"], process.env["ds_password"]).catch(error);