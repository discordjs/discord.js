var Discord = require("../lib/index.js");

var mybot = new Discord.Client();

mybot.login("riftes@outlook.com", "hydrabotsecure", function(err, res){
	console.log(res);
});