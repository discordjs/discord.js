var Discord = require("../");
var client = new Discord.Client();
client.on("debug", (m) => console.log("[debug]",m));
client.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();
client.on("message", m => {
	if(m.content === "&init"){
		for(var channel of m.channel.server.channels){
			if(channel instanceof Discord.VoiceChannel){
				client.joinVoiceChannel(channel).catch(error);
				break;
			}
		}
	}
	if(m.content.startsWith("$$$ stop")){
		if(client.internal.voiceConnection){
			client.internal.voiceConnection.stopPlaying();
		}
		return;
	}
	if(m.content.startsWith("$$$")){
		var chan;
		var rest = m.content.split(" ");
		rest.splice(0, 1);
		rest = rest.join(" ");
		if(client.internal.voiceConnection){
			var connection = client.internal.voiceConnection;
			connection.playFile("C:/users/amish/desktop/"+rest);
		}
	}
});

function error(e){
	console.log(e.stack);
	process.exit(0);
}


client.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));