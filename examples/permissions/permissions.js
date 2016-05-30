/* this bot will see if a user can send TTS messages */

var Discord = require("../../");

var AuthDetails = require("../auth.json");

var bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Ready to begin!");
});

bot.on("message", (msg) => {
	var user = msg.author;

	if(msg.content === "can I tts?"){

		// get the evaluated permissions for a user in the channel they asked
		var permissions = msg.channel.permissionsOf(user);

		if(permissions.sendTTSMessages)
			bot.reply(msg, "You ***can*** send TTS messages.");

		else
			bot.reply(msg, "You ***can't*** send TTS messages.");


	} else if(msg.content === "what are my full permissions?") {

		// get the serialised permissions of the user
		var permissions = msg.channel.permissionsOf(user).serialise();

		// if you want to stringify permissions, they need to be serialised first.

		bot.reply(msg, JSON.stringify(permissions, null, 4).replace(/true/g, "**true**"));

	}

	/*
		for a list of more permissions, go to
		http://discordjs.readthedocs.io/en/indev/docs_permissionconstants.html
	*/

})

bot.loginWithToken(AuthDetails.token);