/*
	this bot will demonstrate text formatting
	that you can use
*/

var Discord = require("../");

// ### to enable text formatting we have to ###
// ### tell discord.js to patch Strings     ###

Discord.patchStrings();

// ...and now we can use the awesome formatting!

// Get the email and password
var AuthDetails = require("./auth.json");

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", function () {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
	
});

bot.on("message", function (msg) {
	if (msg.content == "format") {
		
		// to format your text bold, do this:
		bot.reply(msg, "this is bold".bold);
		
		// to format your text oblique/italics, do this:
		bot.reply(msg, "this is italic".italic);
		
		// etc:
		bot.reply(msg, "this is underlined".underline);
		bot.reply(msg, "this is striked through".strike);
		bot.reply(msg, "this is inline code".code);
		bot.reply(msg, "this is a block of code".codeblock);
		bot.reply(msg, "this ends with a newline".newline + "...see!");
		
		// you can also chain them!
		bot.reply(msg, "this is underlined, italic and bold".underline.italic.bold);
		
		// in any order
		bot.reply(msg, "this is italic, bold, striked and underlined".italic.underline.strike.bold);
		
		// you can join newlines together easily:
		bot.reply(msg, "this is line 1".newline + "this is line 2".newline);
		
	}
});

bot.login(AuthDetails.email, AuthDetails.password);