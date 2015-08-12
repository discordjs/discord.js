var Discord = require( "discord.js" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

myBot.on( "presence", function( user, status, server ) {
	bot.sendMessage( server.getDefaultChannel(), user.mention() + " is " + status + "!" );
} );
