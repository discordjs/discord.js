/* global describe */
/* global process */

var Discord = require("../");
var client = new Discord.Client();
var request = require("superagent");

client.on("ready", () => {
	console.log("ready");
});

client.on("message", msg => {

	if(!msg.sender.equals(client.user))
		console.log("received message from " + msg.sender.username);

	if (msg.content === "$bind") {
		msg.channel.server.channels.get("type", "voice").join();
	}

	if (msg.content.startsWith("$play")) {
		var url = msg.content.split(" ")[1];

		client.voiceConnection.playFile(url);

		console.log(request.get(url).end());

	}

	if (msg.content === "$$$") {
		client.sendMessage(msg.sender, "hi!");
	}

});

console.log("INIT");

client.on("debug", console.log)

client.login(process.env["ds_email"], process.env["ds_password"]).catch(console.log);