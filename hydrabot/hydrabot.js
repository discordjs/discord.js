// If you did not clone discord.js, change the require parameter to `discord.js`
// and then run `npm install --save discord.js` in the same directory as this
// file. The bot should then run.
var Discord = require( "../" );

// Load the config file. If you have not already, make one that follows the
// structure : { "email" : "discordEmail", "password" : "discordPassword" }
var BotConfig = require( "./config.json" );

// Create a new Discord Client
var hydrabot = new Discord.Client();

// Log the client in using the auth details in config.json
hydrabot.login( BotConfig.email, BotConfig.password );

console.log( "Starting up..." );

// When the bot is ready to go, output to the console
hydrabot.on( "ready", function() {
	console.log( "Ready!" );
} );

// When the bot gets disconnected, exit.
hydrabot.on( "disconnected", function( obj ) {
	// Say we couldn't connect and then exit
	console.log( "Disconnected - " + obj.reason );
	process.exit( 0 );
} );

hydrabot.on( "message", function( message ) {

	console.log( message );

} );
