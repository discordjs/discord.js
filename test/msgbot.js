/* global describe */
/* global process */

var Discord = require("../");
var client = new Discord.Client({revive : true});
var request = require("superagent");

client.on("ready", () => {
	console.log("ready - " + client.internal.token);
});

client.on("autoRevive", () => {
	console.log("auto revived");
});

client.on("message", msg => {

	if(!msg.sender.equals(client.user))
		console.log("received message from " + msg.sender.username);

	if (msg.content === "$bind") {
		msg.channel.server.channels.get("type", "voice").join();
	}

	if (msg.content === "end") {
		client.destroy();
	}

	if(msg.content === "replyme"){
		msg.reply("hi");
	}

	if (msg.content === "$perms") {
		msg.reply(client.channels.get("id", msg.channel.id));
	}


	if (msg.content.startsWith("$play")) {
		var url = msg.content.split(" ")[1];

		client.voiceConnection.playFile(url, {
			volume : 0.1
		});

	}

	if (msg.content === "$$$") {
		for(var x = 0; x < 60; x++)
			client.reply(msg, x);
	}

});

console.log("INIT");

client.on("debug", msg => console.log("[debug]", msg));

client.login(process.env["ds_email"], process.env["ds_password"]).catch(console.log);


var chan1, chan2;
var msg1, msg2;