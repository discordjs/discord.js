/* this bot will send an image to a channel */

var Discord = require("../");

var AuthDetails = require("./auth.json");

var bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Ready to begin!");
});

bot.on("message", (msg) => {

	if (msg.content === "photos") {
		bot.sendFile(msg, "./test/image.png", "photo.png", (err, sentMessage) => {
			if (err)
				console.log("Couldn't send image: ", err);
		});
	}

	else if (msg.content === "file") {
		bot.sendFile(msg.channel, new Buffer("Text in a file!"), "file.txt", (err, sentMessage) => {
			if (err)
				console.log("Couldn't send file: ", err)
		});
	}
});

bot.loginWithToken(AuthDetails.token);