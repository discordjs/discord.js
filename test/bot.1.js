var Discord = require("../");
var client = new Discord.Client();
var request = require("superagent");
client.on("debug", (m) => console.log("[debug]", m));
client.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();

client.on("message", m => {

	if (m.content === "$$") {
		client.startTyping(m.channel);
	} else if (m.content === "!!") {
		client.stopTyping(m.channel);
	} else if (m.content === "changename") {
		client.setUsername("Hydrabot!");
	} else if (m.content === "setav") {
		var fs = require("fs");
		client.setAvatar(fs.readFileSync("./test/image.png"));
	} else if (m.content.startsWith("startplaying")) {
		var game = m.content.split(" ").slice(1).join(" ");
		client.setPlayingGame(game);
	} else if (m.content.startsWith("setstatus")) {
		var game = m.content.split(" ").slice(1).join(" ");
		client.setStatus(game);
	}

});

function error(e) {
	console.log(e.stack);
	process.exit(0);
}


client.login(process.env["discordEmail"], process.env["discordPass"]).catch((e) => console.log(e));