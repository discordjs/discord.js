/*
	this bot is an avatar bot, and will give a user their avatar's URL
*/

var Discord = require("../");

// Get the email and password
var AuthDetails = require("./auth.json");

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", function () {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
	
});

bot.on("message", function (msg) {
	if (msg.content === "$avatar") {
		
		//see if the user has an avatar
		if( msg.sender.avatarURL ){
			bot.reply(msg, msg.sender.avatarURL);
		}else{
			//using reply with a message automatically does:
			// '@sender, ' for you!
			bot.reply(msg, "you don't have an avatar!");
		}
		
		//alert the console
		console.log("served " + msg.sender.username);

	}
});

bot.login(AuthDetails.email, AuthDetails.password);