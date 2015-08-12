/*
 * A bot that shows how to listen to presence update events, such as a user
 * joining or leaving.
 */

var Discord = require( "discord.js" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

// The "presence" event is triggered when a user joins a server, leaves it or
// goes away.
// The status parameter can be "online", "offline" or "idle", respectively.
myBot.on( "presence", function( user, status, server ) {
	// Send a message on the default channel of the server, as presence updates
	// are not restricted to one channel.
	bot.sendMessage( server.getDefaultChannel(), user.mention() + " is " + status + "!" );
} );
