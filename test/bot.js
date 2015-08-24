var Discord = require("../lib/index.js");
var Auth = require("./auth.json");
var mybot = new Discord.Client();

mybot.login(Auth.email, Auth.password, function(err, res){
	
});

mybot.on("ready", function(){
	console.log("Ready!");
})

mybot.on("message", function(msg){
	console.log("Another message by "+msg.author.username+"... now I have "+mybot.messages.length + " I have been online for " + mybot.uptime);
})

mybot.on("messageDelete", function(channel, message){
	
	console.log("MESSAGE WAS DELETED BY " + ( message ? message.author.username : channel.name ));
	
});

mybot.on("messageUpdate", function(message, formerMessage){
	
	console.log(message.author.username, "changed", formerMessage.content, "to", message.content);
	
});

mybot.on("serverNewMember", function(user){
	console.log("new user", user.username);
});
mybot.on("serverRemoveMember", function(user){
	console.log("left user", user.username);
});
mybot.on("userUpdate", function(oldUser, newUser){
	console.log(oldUser, "vs", newUser);
});