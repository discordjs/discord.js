/*
	this bot is a permissions bot and is currently working
	with the experimental additions. Some functions may
	change in the future.
*/

var Discord = require("../../");

// Get the email and password
var AuthDetails = require("../auth.json");

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", function () {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
	
});

bot.on("message", function (msg) {
	if (msg.content === "skype") {
		
		//stop the user from speaking in the channel:
		bot.overwritePermissions(msg.channel, msg.sender, {
			sendMessages: false
		});
		
		// send a barely funny message ;)
		bot.reply(msg, "how dare you mention that!");

	}

	if (msg.content === "discord") {
		
		// if the role doesn't exist, make it
		bot.createRoleIfNotExists(msg.channel.server, {
			name: "good people",
			color: Discord.Colors.BLUE, // colour of blue
			hoist: true // make a seperate category in the users list
		}).then(addUserToList).catch(console.log);

		function addUserToList(role, alreadyExists) {
			console.log(arguments);
			bot.addMemberToRole(msg.sender, role);
			bot.reply(msg, "welcome to the good people! " + alreadyExists);

		}

	}

	if (msg.content === "remove me") {
		// remove the user from the good people list, if it exists
		var found = false;

		for (var role of msg.channel.server.roles) {
			if (role.name === "good people") {
				found = role;
				break;
			}
		}

		if (found) {
			// if the role exists
			
			if (msg.sender.hasRole(role)) {
				// remove the member from the role
				bot.removeMemberFromRole(msg.sender, role);
				bot.reply(msg, "removed!")
			} else {
				bot.reply(msg, "you're not in the role!");
			}

		} else {
			// role doesn't exist
			bot.reply(msg, "the role doesn't even exist!");
		}

	}

});

bot.login(AuthDetails.email, AuthDetails.password);