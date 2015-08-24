var Discord = require("../lib/index.js");
var Auth = require("./auth.json");
var mybot = new Discord.Client();

mybot.login(Auth.email, Auth.password, function(err, res){
	
});

mybot.on("ready", function(){
	console.log("Ready!");
})