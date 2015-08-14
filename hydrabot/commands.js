var Authority = require( "./authority.js" );
var Discord = require( "./hydrabot.js" ).Discord;

Commands = [];

Commands[ "info" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var verbose = hasFlag( params, "verbose" ) || hasFlag( params, "v" );
		var user = getUser( message, params );

		bot.reply( message, [
			"here's some info on " + user.mention() + ":",
			"In channel **#" + message.channel.name + "**" + ( verbose ? " - ID *" + message.channel.id + "*" : "" ), ( message.isPM() ?
				"You're in a private conversation with me!" + ( verbose ? " The ID is " + message.channel.id : "" ) : "In the server **" + message.channel.server.name + "**" + ( verbose ? " - ID *" + message.channel.server.id + "*" : "" )
			),
			"User ID is *" + user.id + "*",
			"Authority/OP Level to me is **" + Authority.getLevel( user ) + "**"
		] );

	}
}

Commands[ "echo" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		bot.sendMessage( message, params.join( " " ), function( err, msg ) {
			if ( err )
				bot.sendMessage( message, "Unable to echo!" );
		} );

	}
}

Commands[ "auth" ] = {
	oplevel: 2,
	fn: function( bot, params, message ) {

		var level = getKey( params, "level", "0" );
		var method = hasFlag( params, "set" ) ? "set" : "get";
		var user = getUser( message, params );

		if ( method === "set" ) {
			if ( authLevel( message.author ) <= level ) {
				bot.reply( message, "that authority level is too high for you to set!" );
			} else if ( user.equals( message.author ) ) {
				bot.reply( message, "you can't alter your own authority level!" );
			} else if ( authLevel( user ) > authLevel( message.author ) ) {
				bot.reply( message, "that user has a higher OP level than you!" );
			} else {
				setAuthLevel( user, level );
				bot.reply( message, "I set the authority of " + user.mention() + " to **" + level + "**" );
			}
		} else {
			bot.reply( message, user.equals( message.author ) ? "Your authority level is **" + authLevel( user ) + "**" : "The authority level of " + user.mention() + " is **" + authLevel( user ) + "**" );
		}

	}
}

Commands[ "clear" ] = {
	oplevel: 1,
	fn: function( bot, params, message ) {

		var initMessage = false,
			cleared = false;

		bot.getChannelLogs( message.channel, 250, function( err, logs ) {

			if ( err ) {
				bot.sendMessage( "Couldn't grab logs to delete messages." );
			} else {

				var deletedCount = 0,
					failedCount = 0,
					todo = logs.length();
				for ( message of logs.contents ) {
					if ( message.author.equals( bot.user ) ) {
						bot.deleteMessage( message, function( err ) {
							todo--;
							if ( err )
								failedCount++;
							else
								deletedCount++;

							if ( todo === 0 ) {
								bot.reply(
									message,
									"Done! " + deletedCount + " message(s) were deleted, with " + failedCount + " error(s).",
									false,
									true, {
										selfDestruct: 5000
									}
								);
								cleared = true;
								deleteInitMessage();
							}
						} );
					} else {
						todo--;
					}
				}

			}

		} );

		bot.reply( message, "clearing up my messages...", function( err, msg ) {
			if ( !err ) {
				initMessage = msg;
				if ( cleared )
					deleteInitMessage();
			}
		} );

		function deleteInitMessage() {
			if ( initMessage ) {
				bot.deleteMessage( initMessage );
			}
		}

	}
}

Commands[ "leave" ] = {
	oplevel: 3,
	fn: function( bot, params, message) {

        if(message.isPM()){
            bot.reply(message, "Umm... I can't leave PMs... How awkward...");
        }else{
            bot.reply(message, "Ok ;( I'm leaving!");
            bot.leaveServer(message.channel.server, function(err){
                if(err){
                    bot.reply(message, "There was an error leaving... how awkward.");
                }
            });
        }
	}
}

exports.Commands = Commands;

function hasFlag( array, flag ) {
	return ~array.indexOf( flag );
}

function getKey( array, key, def ) {

	for ( element of array ) {
		var chunks = element.split( "=" );
		if ( chunks.length > 1 ) {
			if ( chunks[ 0 ] == key ) {
				return chunks[ 1 ];
			}
		}
	}

	return def;

}

function authLevel( user ) {
	return Authority.getLevel( user );
}

function setAuthLevel( user, level ) {
	Authority.setLevel( user, level );
}

function getUser( message, params ) {
	var usr = false;
	if ( !message.isPM() ) {
		var wantedUser = getKey( params, "user", false ) || getKey( params, "u", false );
		if ( wantedUser ) {
			usr = message.channel.server.members.filter( Discord.isUserID( wantedUser ) ? "id" : "username", wantedUser, true );
		}
	}
	if ( !usr )
		usr = message.author;
	return usr;
}
