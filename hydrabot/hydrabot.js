// If you did not clone discord.js, change the require parameter to `discord.js`
// and then run `npm install --save discord.js` in the same directory as this
// file. The bot should then run.
var Discord = require( "../" );
exports.Discord = Discord;

// Load the config file. If you have not already, make one that follows the
// structure : { "email" : "discordEmail", "password" : "discordPassword" }
var BotConfig = require( "./config.json" );

// Load the commands file
var Commands = require( "./commands.js" ).Commands;

// Load the Authority handler
var Authority = require( "./authority.js" );

// Initialise it
Authority.init();

// Create a new Discord Client
var hydrabot = new Discord.Client();

// An array of single character prefixes the bot will respond to
var commandPrefixes = [ "$", "£", "`" ];

// Log the client in using the auth details in config.json
hydrabot.login( BotConfig.email, BotConfig.password );

console.log( "Starting up..." );

var time = Date.now();

// When the bot is ready to go, output to the console
hydrabot.on( "ready", function() {
	console.log( "Ready in "+ (Date.now() - time) +"ms!" );
} );

// When the bot gets disconnected, exit.
hydrabot.on( "disconnected", function( obj ) {
	// Say we couldn't connect and then exit
	console.log( "Disconnected - " + obj.reason );
	console.log(obj.error);
	process.exit( 0 );
} );

hydrabot.on( "message", function( message ) {

	// if the message doesn't begin with a valid command prefix exit
	if ( commandPrefixes.indexOf( message.content.charAt( 0 ) ) == -1 )
		return;

	var command = "",
		params = []; //set the message details

	// remove the prefix from the start of the message
	message.content = message.content.substr( 1 );

	// split the message by slashes. This will yield something
	// like: ["command", "a", "b", "c"].
	var chunks = message.content.split( "/" );

	for ( key in chunks ) { //loop through the chunks and trim them
		chunks[ key ] = chunks[ key ].trim();
	}

	command = chunks[ 0 ]; //the first param will be the command
	params = chunks.slice( 1 );

	// it's less messy if we outsource to another function
	handleMessage( command, params, message );

} );

function handleMessage( command, params, message ) {

	if ( Commands[ command ] ) {

		if ( Authority.getLevel( message.author ) >= Commands[ command ].oplevel ) {
			//user has authority to do this
			Commands[ command ].fn( hydrabot, params, message );

		} else {
			//user doesn't have authority
			hydrabot.reply( message, exports.AUTH_ERROR );
		}

	} else {
		hydrabot.reply( message, exports.NOT_FOUND );
	}

}

exports.AUTH_ERROR = "you don't have authority to do this!";
exports.NOT_FOUND = "that command was not found!";
