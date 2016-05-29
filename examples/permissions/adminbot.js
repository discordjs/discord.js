var Discord = require("../../");

// Get the token
var AuthDetails = require("../auth.json");

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
});

bot.on("disconnected", function () {
	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
});

bot.on("message", function (msg) {
	if (msg.content === "skype") {

		//stop the user from speaking in the channel:
		bot.overwritePermissions(msg.channel, msg.author, {
			sendMessages: false
		});

		// send a barely funny message ;)
		bot.reply(msg, "How dare you mention that!");

	}

	if (msg.content === "discord") {

		var role = msg.server.roles.get("name", "good people");

		// if the role doesn't exist, make it
		if (!role) {
			bot.createRole(msg.server, {
				name: "good people",
				color: "0000FF", // blue
				hoist: true // make a seperate category in the users list
			}).then(createdRole => {
				role = createdRole;
			}).catch(console.log);
		}

		bot.addMemberToRole(msg.author, role);
		bot.reply(msg, "Welcome to the good people!");
	}

	if (msg.content === "remove me") {
		// remove the user from the good people list, if it exists
		var role = msg.server.roles.get("name", "good people");

		if (role) { // if the role exists

			if (msg.author.hasRole(role)) {
				// remove the member from the role
				bot.removeMemberFromRole(msg.author, role);
				bot.reply(msg, "Removed!")
			} else {
				bot.reply(msg, "You're not in the role!");
			}

		} else {
			// role doesn't exist
			bot.reply(msg, "The role doesn't even exist!");
		}

	}

});

bot.loginWithToken(AuthDetails.token);