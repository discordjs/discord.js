/*
	this bot is a ping pong bot, and every time a message
	beginning with "ping" is sent, it will reply with
	"pong".
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
	if (msg.content.substring(0, 4) === "ping") {
		
		//send a message to the channel the ping message was sent in.
		bot.sendMessage(msg.channel, "pong!");
		
		//alert the console
		console.log("pong-ed " + msg.sender.username);

	}
});

bot.login(AuthDetails.email, AuthDetails.password);