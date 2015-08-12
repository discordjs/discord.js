/*
 * A bot that shows how to mention users in messages and how to
 * access user avatars.
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
	// React to all messages with the content "$avatar"
	if ( message.content === "$avatar" ) {
		// Obtain the user who requested the avatar.
		var user = message.author;

		// Check whether the user actually has an avatar.
		if ( user.avatar ) {
			// Construct the avatar URL from the user ID and the avatar ID.
			var url = "https://discordapp.com/api/users/" + user.id + "/avatars/" + user.avatar + ".jpg";

			// A user can be mentioned in a message by inserting the string obtained
			// by user.mention() into the message.
			// Note that simply writing "@user" will NOT work.
			this.sendMessage( message.channel, message.author.mention() + ", here's your avatar: " + url );
		} else {
			// Nothing should be done if the user has not set an avatar.
			this.sendMessage( message.channel, message.author.mention() + ", you don't have an avatar!" );
		}
	}
} );
