/* this bot will see if a user can send TTS messages */

var Discord = require("../");

var AuthDetails = require("./auth.json");

var bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Ready to begin!");
});

bot.on("message", (msg) => {
	
	if(msg.content === "can I tts?"){
		
		var user = msg.sender;
		
		// get the evaluated permissions for a user in the channel they asked
		var permissions = msg.channel.permissionsOf(user);
		
		if(permissions.sendTTSMessages){
			
			bot.reply(msg, "You *can* send TTS messages.");
			
		}else{
			
			bot.reply(msg, "You *can't* send TTS messages.");
			
		}
		
	}
	
	/*
		for a list of more permissions, go to
		https://github.com/hydrabolt/discord.js/blob/master/src/EvaluatedPermissions.js
	*/
	
})

bot.login(AuthDetails.email, AuthDetails.password);