/*
 * A bot that shows how to access and search the logs of a specific channel.
 * Specifically, it returns the last message from a given user in the last
 * 100 messages.
 */

var Discord = require( "../" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

// The "ready" event is triggered after the bot successfully connected to
// Discord and is ready to send messages.
myBot.on( "ready", function() {
	console.log( "Bot connected successfully." );
} );

myBot.on( "message", function( message ) {
	// React to all messages starting with "$query".
	if ( message.content.split(" ")[0] === "$query") {
		// Obtain the channel for which logs should be accessed.
		var channel = message.channel;

		// Find all the arguments to the command.
		var arguments = message.content.split( " " );

		// Get the arguments, as they contains the username
		// to be queried for.
		var username = arguments.slice( 1 ).join( " " );

		// Exit the event handler unless the user exists.
		if ( !username ) {
			myBot.sendMessage( channel, "That user doesn't exist!" );
			return;
		}

		// The getChannelLogs() function takes the channel that should be accessed,
		// the amount of messages to query and a callback as its arguments.
		myBot.getChannelLogs( channel, 1000, function( messageList ) {
			// filter() takes three arguments, the key to be filtered for (in this
			// case the username, so "username"), the value to look for, and whether
			// only the first finding should be returned (true) or a list of all
			// findings (false).
			var message = messageList.deepFilter( ["author", "username"], username, true );

			// Only continue if the message has been found
			if ( message ) {
				myBot.sendMessage( channel, "The last message from user " + username + " is:\n_" + message.content + "_" );
			} else {
				myBot.sendMessage( channel, "That user has not sent a message for the last 1,000 messages!" );
			}
		} );
	}

} );
