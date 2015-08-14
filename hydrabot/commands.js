var Authority = require( "./authority.js" );
var BotClass = require( "./hydrabot.js" );
var Discord = BotClass.Discord;

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
			if ( err ){
				bot.sendMessage( message, "Unable to echo!" );
                console.log(err);
            }
		} );

	}
}

Commands[ "auth" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var level = getKey( params, "level", "0" );
		var method = hasFlag( params, "set" ) ? "set" : "get";
		var user = getUser( message, params );

		if ( method === "set" ) {
			if ( authLevel( message.author ) <= level ) {
				bot.reply( message, "that authority level is too high for you to set!" );
			} else if ( user.equals( message.author ) ) {
				bot.reply( message, "you can't alter your own authority level!" );
			} else if ( authLevel( user ) >= authLevel( message.author ) ) {
				bot.reply( message, "that user has a higher or equal OP level to you!" );
			} else if ( level < 0 ) {
				bot.reply( message, "that level's a bit too low :P" );
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
	oplevel: 0,
	fn: function( bot, params, message ) {

		if ( !message.isPM() ) {
			if ( authLevel( message.author ) < 1 ) {
				bot.reply( message, BotClass.AUTH_ERROR );
				return;
			}
		}

		var initMessage = false,
			cleared = false;

		bot.getChannelLogs( message.channel, 250, function( err, logs ) {

			if ( err ) {
				bot.sendMessage( "Couldn't grab logs to delete messages." );
			} else {

				var deletedCount = 0,
					failedCount = 0,
					todo = logs.length();
				for ( msg of logs.contents ) {
					if ( msg.author.equals( bot.user ) ) {
						bot.deleteMessage( msg, function( err ) {
							todo--;
							if ( err )
								failedCount++;
							else
								deletedCount++;

							if ( todo === 0 ) {
								bot.reply(
									msg,
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
	fn: function( bot, params, message ) {

		var silent = hasFlag( params, "s" ) || hasFlag( params, "silent" );

		if ( message.isPM() ) {
			bot.reply( message, "Umm... I can't leave PMs... How awkward..." );
		} else {

			if ( !silent )
				bot.reply( message, "Ok ;( I'm leaving!" );

			bot.leaveServer( message.channel.server, function( err ) {
				if ( err ) {
					bot.reply( message, "There was an error leaving... how awkward." );
				}
			} );
		}
	}
}

Commands[ "avatar" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var user = getUser( message, params );

		if ( !user.avatar ) {
			bot.sendMessage( message.channel, user.mention() + " does not have an avatar!" );
		} else {
			bot.reply( message, user.getAvatarURL() );
		}
	}
}

Commands[ "icon" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		if ( message.isPM() ) {
			bot.reply( message, "PMs don't have avatars!" );
			return;
		}

		if ( !message.channel.server.icon ) {
			bot.reply( message, "this server does not have an icon!" );
			return;
		}

		bot.reply( message, message.channel.server.getIconURL() );

	}
}

Commands[ "remind" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var time = parseInt( getKey( params, "t" ) || getKey( params, "time" ) ) * 1000 || 21000;
		var msg = getKey( params, "m" ) || getKey( params, "msg" ) || getKey( params, "message" );

		bot.reply( message, "I'll remind you to *" + msg + "* in *" + time / 1000 + "* seconds.", false, true, {
			selfDestruct: time
		} );

		setTimeout( send, time );

		function send() {
			bot.sendMessage( message.author, time + " seconds are up! **" + msg + "**." );
		}

	}
}

Commands[ "activity" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

        var amount = getKey(params, "amount") || getKey(params, "n") || 250;
        var limit = getKey(params, "limit") || getKey(params, "l") || 10;

        bot.getChannelLogs(message.channel, amount, function(err, logs){

            if(err){
                bot.reply(message, "error gettings logs.");
            }else{

                var activity = {}, count = 0;
                for(msg of logs.contents){

                    count = logs.length();

                    if(!activity[msg.author.id])
                        activity[msg.author.id] = 0;
                    activity[msg.author.id]++;
                }

                var report = "here's a list of activity over the last "+count+" messages :\n\n";

                var users = {};

                for(id in activity){
                    users[id] = message.channel.server.members.filter("id", id, true);
                }

                activity = Object.keys(activity).sort(function(a,b){return activity[a]-activity[b]});

                for(id in activity){
                    report += id + " | "+activity[id]+" | **"+ Math.round( (activity[id] / count) * 100 ) +"%**.\n";
                }

                bot.reply(message, report, false, false);
            }

        });

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
