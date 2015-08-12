/*
 * Discord uses a subset of Markdown for formatting, so adding formatting to
 * messages is as simple as inserting the formatting codes into the message.
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
	// React to all messages with the content "$formatting".
	if ( message.content === "$formatting" ) {
    // Show off formatting by sending a simple message with formatting codes.
    this.sendMessage( message.channel, "**bold** ****semibold**** *italic* " +
        "_**bold and italic**_ __underline__ ~~strikethrough~~" );
	}
} );
