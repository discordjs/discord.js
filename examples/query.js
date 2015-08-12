/*
 * A bot that shows how to access and search the logs of a specific channel.
 * Specifically, it returns the last message from a given user in the last
 * 100 messages.
 */

var Discord = require( "discord.js" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

myBot.on( "message", function( message ) {
	// React to all messages starting with "$query".
	if ( message.content.startsWith( "$query" ) ) {
    // Obtain the channel for which logs should be accessed.
    var channel = message.channel;

    // Find all the arguments to the command.
    var arguments = message.content.split(" ");

    // Get the first argument specifically, as it contains the username
    // to be queried for.
    var username = arguments[1];

    // Exit the event handler unless the user exists.
    if( !username ) {
      myBot.sendMessage(channel, "That user doesn't exist!");
      return;
    }

    // The getChannelLogs() function takes the channel that should be accessed,
    // the amount of messages to query and a callback as its arguments.
    myBot.getChannelLogs( channel, 100, function( messageList ) {
      // filter() takes three arguments, the key to be filtered for (in this
      // case the username, so "username"), the value to look for, and whether
      // only the first finding should be returned (true) or a list of all
      // findings (false).
      var message = messageList.filter( "username", username, true );

      // Only continue if the message has been found
      if( message ) {
        myBot.sendMessage(channel, "The last message from user " + username +
            " is: \"" + message.content + "\".").
      } else {
        myBot.sendMessage("That user has not sent a message " +
            "for the last 100 messages!")
      }
    } );
	}
} );
