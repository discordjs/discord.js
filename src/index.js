module.exports = {
	Client : require("./Client/Client.js")
}

var VoiceChannel = require("./Structures/VoiceChannel.js");

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();
a.on("message", m => {
	if(m.content === "$$$"){
		for(var channel of m.channel.server.channels){
			if(channel instanceof VoiceChannel){
				a.internal.joinVoiceChannel(channel).catch(error);
				break;
			}
		}
	}
});

function error(e){
	console.log(e);
	process.exit(0);
}


a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));