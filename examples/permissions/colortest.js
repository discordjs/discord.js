/*
	this bot will demonstrate the different ways you
	can create colors in Discord.
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

	// to use this example, you first have to send 'create role'
	// you can then change colors afterwards.

	if (msg.content === "create role") {
		// create the role and add the user to it

		bot.createRole(msg.server, {
			name: "Custom Colors",
			hoist: true, // so it is visible in the members list
		}).then(createdRole => { // this is executed when the role has been created

			// adds the sernder to the role
			bot.addMemberToRole(msg.author, createdRole).then(() => {
				bot.reply(msg, "Added you to the role!");
			});
		});
	}

	else if (msg.content.startsWith("custom color")) {

		// valid custom colors must follow the format of any of the following:
		/*
			#ff0000 <- valid 7 digit hex (including #)
			ff0000 <- valid 6 digit hex
			16711680 <- valid decimal number (this if #ff0000 as a decimal)
		*/

		var colorName = msg.content.split(" ")[2];

		// get the role by its name
		var role = msg.server.roles.get("name", "Custom Colors");

		// updates the role with the given color
		bot.updateRole(role, {
			color: colorName
		}).then(function (role) {

			// this executes if the change was successful
			bot.reply(msg, "Done! Using the color " + colorName);
		}).catch(function (e) {

			// this executes if it wasn't successful
			bot.reply(msg, "An error occurred. Was that a valid hex/dec color?");
		});
	}
});

bot.loginWithToken(AuthDetails.token);