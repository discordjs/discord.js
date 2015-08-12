/*
 * A bot that shows how to listen to presence update events, such as a user
 * joining or leaving.
 */

var Discord = require( "../" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

// The "ready" event is triggered after the bot successfully connected to
// Discord and is ready to send messages.
myBot.on( "ready", function() {
  console.log( "Bot connected successfully." );
} );

// The "presence" event is triggered when a user joins a server, leaves it or
// goes away.
// The status parameter can be "online", "offline" or "idle", respectively.
myBot.on( "presence", function( user, status, server ) {
	// Send a message on the default channel of the server, as presence updates
	// are not restricted to one channel.
    var message = user.mention() + " is " + status + " in " + server.name + "!";
    console.log(message);
	this.sendMessage( server.getDefaultChannel(), message );
} );
