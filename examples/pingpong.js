/*
 * A basic bot that shows how to connect to a Discord account,
 * how to listen to messages and how to send messages.
 *
 * This bot responds to every "ping" message with a "pong".
 */

var Discord = require( "../" );

// Create the bot
var myBot = new Discord.Client();

// Login with an example email and password
myBot.login( "hello@example.com", "password1" );

// The "ready" event is triggered after the bot successfully connected to
// Discord and is ready to send messages.
myBot.on( "ready", function() {
	console.log( "Bot connected successfully." );
} );

// Add a listener to the "message" event, which triggers upon receiving
// any message
myBot.on( "message", function( message ) {
	// message.content accesses the content of the message as a string.
	// If it is equal to "ping", then the bot should respond with "pong".
	if ( message.content === "ping" ) {
		// Send a message ("pong") to the channel the message was sent in,
		// which is accessed by message.channel.
		this.sendMessage( message.channel, "pong" );
	}
} );
