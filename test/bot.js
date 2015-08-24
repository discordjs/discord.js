var Discord = require("../lib/index.js");
var Auth = require("./auth.json");
var mybot = new Discord.Client();

mybot.login(Auth.email, Auth.password, function(err, res){
	
});

mybot.on("ready", function(){
	console.log("Ready!");
})

mybot.on("message", function(msg){
	console.log("Another message by "+msg.author.username+"... now I have "+mybot.messages.length);
})

mybot.on("messageDelete", function(channel, message){
	
	console.log("MESSAGE WAS DELETED BY " + ( message ? message.author.username : channel.name ));
	
});