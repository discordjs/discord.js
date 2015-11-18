var Discord = require("../");
var client = new Discord.Client();
var request = require("superagent");
client.on("debug", (m) => console.log("[debug]", m));
client.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();

client.on("message", m => {
	if(m.content === "death"){
		m.channel.delete();
	}
	if (m.content.startsWith("join: ")) {
		var invite = m.content.split(" ")[1];
		client.joinServer(invite).then(console.log).catch(console.log);
	}
	if (m.content === "&init") {
		for (var channel of m.channel.server.channels) {
			if (channel instanceof Discord.VoiceChannel) {
				client.reply(m, channel.name + " - " + channel.id);
				client.joinVoiceChannel(channel).catch(error);
				break;
			}
		}
	}
	if (m.content.startsWith("$$$ stop")) {
		if (client.internal.voiceConnection) {
			client.internal.voiceConnection.stopPlaying();
		}
		return;
	}if (m.content.startsWith("$$$ leave")) {
		client.internal.leaveVoiceChannel();
		return;
	}
	if (m.content.startsWith("$$$")) {
		var chan;
		var rest = m.content.split(" ");
		rest.splice(0, 1);
		rest = rest.join(" ");
		if (client.internal.voiceConnection) {
			client.reply(m, "ok, I'll play that for you");
			var connection = client.internal.voiceConnection;
			connection.playFile("C:/users/amish/desktop/" + rest);
		}
	} if (m.content.startsWith("pipeit")) {
		var chan;
		var rest = m.content.split(" ");
		rest.splice(0, 1);
		rest = rest.join(" ");

		if (client.internal.voiceConnection) {
			var connection = client.internal.voiceConnection;
			var request = require("request");
			connection.playRawStream(request(rest)).then(intent => {
				client.reply(m, "playing!").then((msg) => {
					
					intent.on("end", () => {
						client.updateMessage(msg, "that song has finished now.");
					});
					
				});
				
			});
		}
	}
});

function error(e) {
	console.log(e.stack);
	process.exit(0);
}


client.login(process.env["discordEmail"], process.env["discordPass"]).catch((e) => console.log(e));