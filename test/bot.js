var Discord = require("../lib/index.js");

var mybot = new Discord.Client();

mybot.login("email", "pass", function(err, res){
	
});

mybot.on("ready", function(){
	console.log("Ready!");
})