/* this bot will send an image to a channel */

var Discord = require("../");

var AuthDetails = require("./auth.json");

var bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Ready to begin!");
});

bot.on("message", (msg) => {

	if (msg.content === "photos") {

		bot.sendFile( msg.channel, "./test/image.png", "photo.png", (err, msg) => {
			if(err)
				console.log("couldn't send image:", err);
		});

	}
	
	if( msg.content === "file" ) {
		bot.sendFile( msg.channel, new Buffer("Text in a file!"), "file.txt", (err, msg) => {
			if(err)
				console.log("couldn't send file:", err);
		});
	}

})

bot.login(AuthDetails.email, AuthDetails.password);