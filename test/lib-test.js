/* global describe */
/* global process */

var Discord = require("../");
var client = new Discord.Client();
var colors = require("colors");
var fs = require("fs");

var passes = 0, fails = 0;

function section(s) {
	console.log("\n    " + s.yellow);
}

function pass(msg) {
	console.log("      ✓ ".green + msg);
}

function err(msg) {
	console.log("      ✗ ".red + msg);
	process.exit(1);
}

console.log("Beginning Lib Test".yellow);

section("Logging In");

client.on("ready", () => {
	pass("received ready");

	makeServer();
})

client.login(process.env["ds_email"], process.env["ds_password"]).then(token => {

	if (!token || token.length < 1) {
		err("bad token");
		return;
	}

	pass("valid login token");

}).catch(e => err("error logging in: " + e));

var server, channel, message;

function makeServer() {

	section("Server Creation");
	client.createServer("test", "london").then(srv => {

		if (!srv) {
			err("server not passed");
			return;
		}

		if (srv.name !== "test" || srv.region !== "london") {
			err("invalid server name/region");
			return;
		}

		if (!srv.members.has(client.user)) {
			console.log(srv.members);
			err("client not included in members list");
			return;
		}

		pass("created server");
		pass("valid server name & region");
		pass("client included in server members");

		server = srv;

		makeChannel();

	}).catch(e => {
		err("couldn't create server: " + e);
	});
}

function makeChannel() {
	section("Channel Creation");

	client.createChannel(server, "testchannel", "text").then(chann => {

		if (!chann) {
			err("channel not passed");
			return;
		}

		if (chann.name !== "testchannel" || chann.type !== "text") {
			err("invalid channel name/type");
			return;
		}

		pass("channel created");
		pass("valid channel name & type");

		channel = chann;

		editChannel();

	});
}

function editChannel() {
	section("Channel Manipulation");

	client.setChannelNameAndTopic(channel, "testing", "a testing channel - temporary").then(() => {

		if (channel.name !== "testing" || channel.topic !== "a testing channel - temporary") {
			err("channel not updated");
			return;
		}

		pass("channel name and topic updated");

		sendMsg();

	}).catch(e => {
		err("error editting channel: " + e);
	});
}

function sendMsg() {
	section("Message Creation");

	client.sendMessage(channel, "test message!", { tts: true }).then(msg => {

		if (!msg) {
			err("message not passed");
			return;
		}

		if (msg.content !== "test message!" || !msg.sender.equals(client.user) || !msg.channel.equals(channel)) {
			err("invalid content, sender or channel assigned to message");
			return;
		}

		if (!msg.tts) {
			err("message wasn't TTS on response, even though on request it was");
			return;
		}

		pass("message successfully created");
		pass("correct parameters in message");

		message = msg;

		editMsg();

	}).catch(e => {
		err("error sending message: " + e)
	});
}

function editMsg() {

	section("Message Manipulation");

	client.updateMessage(message, client.user + channel + server).then(msg => {

		if (!msg) {
			err("message not passed back on update");
			return;
		}

		if (msg.content !== client.user.mention() + channel.mention() + server.name) {
			err("message content not what expected");
			return;
		}

		pass("message updated");
		pass("message content was as expected - complex");

		client.deleteMessage(message).then(() => {
			pass("message deleted");
			sendFile();
		}).catch(e => {
			err("error deleting message: " + e)
		});

	}).catch(e => {
		err("error updating message: " + e)
	});

}

function sendFile() {
	section("File Sending & Deletion");

	client.sendFile(channel, "./test/image.png", "image.png").then(file => {

		if (!file) {
			err("file not passed");
			return;
		}

		if (file.attachments.length === 0) {
			err("attachment not added");
			return;
		}

		pass("sent attachment file");

		client.deleteMessage(file).then(() => {
			pass("message deleted");
			deleteAll();
		}).catch(e => {
			err("error deleting message: " + e)
		});

	}).catch(e => {
		err("error sending file: " + e);
	});
}

function deleteAll() {

	section("Clean Up");

	client.deleteChannel(channel).then(() => {

		pass("deleted temporary channel");

		client.leaveServer(server).then(() => {
			
			pass("deleted temporary server");
			
			exit();
			
		}).catch(e => {
			err("error deleting server: " + e);
		});

	}).catch(e => {
		err("error deleting channel: " + e);
	});

}

function exit() {
	
	section("Exiting");
	
	client.logout().then(() => {
		pass("logged out");
		done();
	}).catch(e => {
		err("couldn't log out: " + e);
	});
	
}

function done() {
	section("Report");
	pass("all tests done");
	process.exit(0);
}