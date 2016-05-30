/*
	this bot is an avatar bot, and will give a user their avatar's URL
*/

var Discord = require("../");

var AuthDetails = require("./auth.json");

var bot = new Discord.Client();

bot.on("ready", () => {
	console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
});

bot.on("disconnected", () => {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error

});

bot.on("message", (msg) => {

	// if the message is avatar
	if (msg.content === "avatar") {
		bot.reply(msg, "Here is the URL for your avatar: " + msg.author.avatarURL);
	}

});

bot.loginWithToken(AuthDetails.token);