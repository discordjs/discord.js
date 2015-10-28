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
		
		bot.createRoleIfNotExists(msg.channel.server, {
			name: "Custom Colors",
			hoist: true, // so it is visible in the members list
		}).then(function (permission) {
			// this is executed when the role has been created or exists
			
			// adds the sender to the role
			bot.addMemberToRole(msg.sender, permission).then(function () {
				bot.reply(msg, "added you to the role!");
			});

		});

	}

	if (msg.content.indexOf("preset color") === 0) {
		
		// set the role to a preset color
		var colorName = msg.content.split(" ")[2];
		
		// get the role by its name
		var role = msg.channel.server.getRole("name", "Custom Colors");

		// if the color exists as a preset
		if (Discord.Color[colorName]) {
			
			// update the role with the new color
			bot.updateRole(role, {
				color: Discord.Color[colorName]
			}).then(function (role) {
				// this executes if the change was correct
				bot.reply(msg, "done! using the color " + Discord.Color.toHex(role.color));
			});

		} else {
			bot.reply(msg, "that color isn't a preset color!");
		}

	}

	if (msg.content.indexOf("custom color") === 0) {

		// valid custom colors must follow the format of any of the following:
		/*
			#ff0000 <- valid 7 digit hex (including #)
			ff0000 <- valid 6 digit hex
			16711680 <- valid decimal number (this if #ff0000 as a decimal)
		*/

		var colorName = msg.content.split(" ")[2];
		
		// get the role by its name
		var role = msg.channel.server.getRole("name", "Custom Colors");

		// updates the role with the given color
		bot.updateRole(role, {
			color: colorName
		}).then(function (role) {
			
			// this executes if the change was successful
			bot.reply(msg, "done! using the color " + Discord.Color.toHex(role.color));
		
		}).catch(function (e) {
			
			// this executes if it wasn't successful
			bot.reply(msg, "an error occurred. Was that a valid hex/dec color?");
		
		})

	}

});

bot.login(AuthDetails.email, AuthDetails.password);