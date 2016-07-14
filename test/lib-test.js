/* global describe */
/* global process */

var Discord = require("../");
var client = new Discord.Client();
var colors = require("colors");
var fs = require("fs");

var passes = 0, fails = 0;

function section(s) {
	console.log("\n    " + s.yellow.bold.underline);
}

function pass(msg) {
	console.log("      ✓ ".green + msg.italic);
}

function err(msg) {
	console.log("      ✗ ".red + msg.italic);
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

var server, channel, message, role, invserver;

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

	client.setChannelName(channel, "testing").then(() => {

		if (channel.name !== "testing") {
			err("channel name not updated");
			return;
		}

		pass("channel name updated");

		client.setChannelTopic(channel, "a testing channel - temporary").then(() => {

			if (channel.topic !== "a testing channel - temporary"){
				err("channel topic not updated");
				return;
			}

			pass("channel topic updated");

			sendMsg();

		});

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
			roleCreate();
		}).catch(e => {
			err("error deleting message: " + e)
		});

	}).catch(e => {
		err("error sending file: " + e);
	});
}

function roleCreate() {
	section("Role Management");

	client.createRole(server, {
		name: "test role",
		hoist: true,
		color: 0xFF0000,
		permissions: [
			"kickMembers"
		]
	}).then(_role => {

		role = _role;

		pass("created role");

		if (role.name !== "test role" || role.color !== 0xFF0000 || !role.hoist){
			err("bad role name, color or hoist");
			return;
		}

		if (!role.hasPermission("kickMembers")) {
			err("role doesn't have kick members permission");
			return;
		}

		pass("correct role metadata");

		joinInvite();

	}).catch(e => {
		err("error creating role: " + e)
	});
}

function joinInvite() {
	section("Joining Servers");

	client.joinServer(process.env["ds_invite"]).then(srv => {

		invserver = srv;
		pass("passed back server");

		if (srv.name !== "d.j s _ t s" || srv.region !== "london") {
			err("incorrect server name or region");
			return;
		}

		pass("correct server name and region");
		sendPM();

	}).catch(e => {
		err("error joining server: " + e)
	});
}

function sendPM() {
	section("Sending PMs");

	client.sendMessage(invserver.owner, "hello, this is a test!").then(msg => {

		pass("sent PM");

		client.deleteMessage(msg).then(() => {
			pass("deleted PM");
			deleteAll();
		}).catch(e => {
			err("error deleting PM message: " + e);
		});

	}).catch(e => {
		err("error sending a PM: " + e)
	})
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