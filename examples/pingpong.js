/*
	This bot is a ping pong bot, and every time a message
	beginning with "ping" is sent, it will reply with
	"pong!".
*/

var Discord = require("../");

// Get the email and password
var AuthDetails = require("./auth.json");

var bot = new Discord.Client();

//when the bot is ready
bot.on("ready", () => {
	console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
});

//when the bot disconnects
bot.on("disconnected", () => {
	//alert the console
	console.log("Disconnected!");

	//exit node.js with an error
	process.exit(1);
});

//when the bot receives a message
bot.on("message", msg => {
	//if message begins with "ping"
	if (msg.content.startsWith("ping")) {
		//send a message to the channel the ping message was sent in.
		bot.sendMessage(msg, "pong!");

		//alert the console
		console.log("pong-ed " + msg.author.username);
	}
});

bot.loginWithToken(AuthDetails.token);