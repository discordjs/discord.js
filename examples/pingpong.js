var Discord = require( "discord.js" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

myBot.on( "message", function( message ) {
	if ( message.content === "ping" ) {
		this.sendMessage( message.channel, "pong" );
	}
} );
