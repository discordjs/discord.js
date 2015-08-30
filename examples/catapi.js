/*
	this bot will send an image of a cat to a channel.
	may be slow depending on your internet connection.
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
	if (msg.content === "$cat") {
		
		//send a message to the channel the ping message was sent in.
		bot.sendMessage(msg.channel, "pong!");
		
		//alert the console
		console.log("pong-ed " + msg.sender.username);

	}
});

bot.login(AuthDetails.email, AuthDetails.password);