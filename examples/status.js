/*
 * A bot that doesn't interact with Discord, but instead shows how to listen
 * to the "ready" and "disconnected" events, that are triggered when the bot
 * starts up or shuts down, respectively.
 */

var Discord = require( "../" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

// The "ready" event is triggered after the bot successfully connected to
// Discord and is ready to send messages.
myBot.on( "ready", function() {
  console.log( "Bot connected successfully." );
} );

// The "disconnected" event is triggered after the connection to Discord
// ended.
// It is also triggered when the connection attempt fails, for example due
// to a wrong password.
myBot.on( "disconnected", function(e) {
  console.log( "Bot disconnected from Discord -", e.reason );
} );
