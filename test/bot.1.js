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
	}

});

function error(e) {
	console.log(e.stack);
	process.exit(0);
}


client.login(process.env["discordEmail"], process.env["discordPass"]).catch((e) => console.log(e));