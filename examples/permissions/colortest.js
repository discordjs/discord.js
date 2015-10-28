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
	if (msg.content === "create role") {
		// create the role and add the user to it
		
		bot.createRoleIfNotExists(msg.channel.server, {
			name : "Custom Colors",
			hoist : true, // so it is visible in the members list
		}).then(function(permission){
			
			bot.addMemberToRole(msg.sender, permission).then(function(){
				
				bot.reply(msg, "added you to the role!");
				
			});
				
		});
		
	}

	if (msg.content.indexOf("preset color") === 0) {
		
		// set the role to a preset color
		var colorName = msg.content.split(" ")[2];
		var role = msg.channel.server.getRole("name", "Custom Colors");
		
		if(Discord.Color[colorName]){ // if the color is a preset
			
			bot.updateRole(role, {
				color : Discord.Color[colorName]
			}).then(function(){
				bot.reply(msg, "done!");
			});
			
		}else{
			bot.reply(msg, "that color isn't a preset color!");
		}

	}
	
	if (msg.content.indexOf("custom color") === 0) {
		
		var colorName = msg.content.split(" ")[2];
		var role = msg.channel.server.getRole("name", "Custom Colors");
		
		bot.updateRole(role, {
			color : colorName
		}).then(function(){
			bot.reply(msg, "done!");
		}).catch(function(e){
			bot.reply(msg, "an error occurred. Was that a valid hex/dec color?");
		})
		
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