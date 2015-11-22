/* this bot will see if a user can send TTS messages */

var Discord = require("../../");

Discord.patchStrings();

var AuthDetails = require("../auth.json");

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
			bot.reply(msg, "You " + "can".italic.bold + " send TTS messages.");
		}else{
			bot.reply(msg, "You " + "can't".italic.bold + " send TTS messages.");	
		}
		
	}else if(msg.content === "what are my full permissions?"){
		
		var user = msg.sender;
		
		// get the serialised permissions of the user
		var permissions = msg.channel.permissionsOf(user).serialise();
		
		// if you want to stringify permissions, they need to be serialised first.
		
		bot.reply(msg, JSON.stringify(permissions, null, 4).replace(/true/g, "**true**"));
		
	}
	
	/*
		for a list of more permissions, go to
		https://github.com/hydrabolt/discord.js/blob/master/src/EvaluatedPermissions.js
	*/
	
})

bot.login(AuthDetails.email, AuthDetails.password);