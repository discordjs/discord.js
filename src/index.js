module.exports = {
	Client : require("./Client/Client.js")
}

var VoiceChannel = require("./Structures/VoiceChannel.js");

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();
a.on("message", m => {
	if(m.content === "&init"){
		for(var channel of m.channel.server.channels){
			if(channel instanceof VoiceChannel){
				a.joinVoiceChannel(channel).catch(error)
					.then(connection => {
						connection.playFile("C:/users/amish/desktop/asdf.mp3");
					});
				break;
			}
		}
	}
	if(m.content.startsWith("$$$ stop")){
		for(var channel of m.channel.server.channels){
			if(channel instanceof VoiceChannel){
				chan = channel;
				break;
			}
		}
		if(a.internal.voiceConnections[chan]){
			var connection = a.internal.voiceConnections[chan];
			connection.stopPlaying();
		}
		return;
	}
	if(m.content.startsWith("$$$")){
		var chan;
		for(var channel of m.channel.server.channels){
			if(channel instanceof VoiceChannel){
				chan = channel;
				break;
			}
		}
		if(a.internal.voiceConnections[chan]){
			var connection = a.internal.voiceConnections[chan];
			connection.playFile("C:/users/amish/desktop/asdf.mp3");
		}
	}
});

function error(e){
	console.log(e.stack);
	process.exit(0);
}


a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));