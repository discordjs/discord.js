/* global process */
/*
	this file should be used for travis builds only
	or testing local builds
*/

var Discord = require("../");
var mybot = new Discord.Client();

var server, channel, message, role, sentMessage = false, actions = [], current = -1;

function next() {
	current++;
	if (current !== 0) {
		console.log("Success on test", current, actions[current]);
	}
	if (current === actions.length)
		done();
	else
		actions[current].apply(this, arguments);
}

function init() {
	console.log("preparing...");
}

actions.push(() => {
	mybot.createServer("test-server", "london").then(next).catch(error);
});

actions.push((_server) => {
	server = _server;
	mybot.createChannel(server, "test-channel", "text").then(next).catch(error);
});

actions.push((_channel) => {
	channel = _channel;
	mybot.sendMessage(channel, [mybot.user.avatarURL, "an", "array", "of", "messages"]).then(next).catch(error);
});

actions.push((message) => {
	mybot.deleteMessage(message).then(next).catch(error);
});

actions.push(() => {
	mybot.createRole(server, {
		name: "Custom Role",
		color: 0xff0000,
		sendMessages: false
	}).then(next).catch(error);
});

actions.push((_role) => {
	role = _role;
	if (role.name === "Custom Role" && !role.sendMessages) {
		next();
	} else {
		error(new Error("bad role; " + role));
	}
});

actions.push(() => {
	mybot.deleteRole(role).then(next).catch(error);
});

actions.push(() => {
	mybot.sendMessage(channel, "ping").catch(error);
});

actions.push((message) => {
	mybot.updateMessage(message, "pong").then(next).catch(error);
});

actions.push((message) => {
	mybot.deleteMessage(message).then(next).catch(error);
})

actions.push(() => {
	mybot.sendFile(server, "./test/image.png").then(next).catch(error);
})

actions.push(() => {
	mybot.leaveServer(server).then(next).catch(error);
});

// phase 2

actions.push(() => {
	mybot.joinServer(process.env["ds_invite"]).then(next).catch(error);
});

actions.push((_server) => {
	server = _server;
	mybot.sendMessage(server.getMember("username", "hydrabolt"), "Travis Build test").then(next).catch(error);
});

actions.push((_message) => {
	mybot.deleteMessage(_message).then(next).catch(error);
});

actions.push(() => {
	mybot.logout().then(next).catch(error);
});

mybot.on("message", function (message) {
	if(!message.isPrivate){
		if (message.channel.equals(channel)) {
			if (message.content === "ping") {
				sentMessage = true;
				next(message);
			}
		}
	}
})

mybot.once("ready", function () {
	console.log("ready! beginning tests");
	next();
});

mybot.login(process.env["ds_email"], process.env["ds_password"]).then(init).catch(error);

function done() {
	console.log("Finished! Build successful.");
	process.exit(0);
}

function error(e) {
	console.log("FAILED DURING TEST", current);
	console.log(e.stack);
	process.exit(1);
}