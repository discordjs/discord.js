var Discord = require("../");
var client = new Discord.Client();
client.on("debug", (m) => console.log("[debug]",m));
client.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();
client.on("message", m => {
	if(m.content === "&init"){
		for(var channel of m.channel.server.channels){
			if(channel instanceof Discord.VoiceChannel){
				client.joinVoiceChannel(channel).catch(error)
					.then(connection => {
						connection.playFile("C:/users/amish/desktop/Developers.mp3");
					});
				break;
			}
		}
	}
	if(m.content.startsWith("$$$ stop")){
		for(var channel of m.channel.server.channels){
			if(channel instanceof Discord.VoiceChannel){
				chan = channel;
				break;
			}
		}
		if(client.internal.voiceConnections.get("id", chan.id)){
			var connection = client.internal.voiceConnections.get("id", chan.id);
			connection.stopPlaying();
		}
		return;
	}
	if(m.content.startsWith("$$$")){
		var chan;
		for(var channel of m.channel.server.channels){
			if(channel instanceof Discord.VoiceChannel){
				chan = channel;
				break;
			}
		}
		if(client.internal.voiceConnections.get("id", chan.id)){
			var connection = client.internal.voiceConnections.get("id", chan.id);
			connection.playFile("C:/users/amish/desktop/Developers.mp3");
		}
	}
});

function error(e){
	console.log(e.stack);
	process.exit(0);
}


client.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));