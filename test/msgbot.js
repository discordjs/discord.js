/* global describe */
/* global process */

var Discord = require("../");
var client = new Discord.Client({revive : true});
var request = require("request");

client.on("ready", () => {
	console.log("ready - " + client.internal.token);
});

client.on("autoRevive", () => {
	console.log("auto revived");
});

client.on("voiceJoin", (user, channel) => {
	console.log(`VOICE ${user.username} joined ${channel}!`);
});

client.on("voiceLeave", (user, channel) => {
	console.log(`VOICE ${user.username} left ${channel}!`);
});

client.on("message", msg => {

	if(!msg.sender.equals(client.user))
		console.log("received message from " + msg.sender.username);

	if (msg.content === "$bind") {
		msg.channel.server.channels.get("type", "voice").join();
	}

	if (msg.content === "$end$") {
		client.destroy();
	}

	if (msg.content === "$stop_playing") {
		client.voiceConnection.stopPlaying();
	}

	if (msg.content === "where am I speaking") {
		msg.reply(msg.sender.voiceChannel);
	}

	if (msg.content === "who is speaking") {
		for (var chan of msg.channel.server.channels.getAll("type", "voice")) {
			msg.channel.send(`${chan} : ${chan.members}`);
		}
	}

	if (msg.content === "what is my name") {
		msg.reply(msg.channel.server.members.get("id", msg.sender.id));
	}

	if(msg.content === "replyme"){
		msg.reply("hi");
	}

	if (msg.content === "$perms") {
		msg.reply(client.channels.get("id", msg.channel.id));
	}


	if (msg.content.startsWith("$play")) {
		var url = msg.content.split(" ")[1];

		client.voiceConnection.playRawStream(request(url));

	}

	if (msg.content === "$$$") {
		for(var x = 0; x < 60; x++)
			client.reply(msg, x);
	}

});

console.log("INIT");

client.forceFetchUsers();

client.on("debug", msg => console.log("[debug]", msg));
client.on("unk", msg => console.log("[unknown]", msg));

client.login(process.env["ds_email"], process.env["ds_password"]).catch(console.log);

//client.on("presence", (old, news) => console.log(`PRESENCE TEST ${old.username} $$ ${news.username}`))
var chan1, chan2;
var msg1, msg2;
