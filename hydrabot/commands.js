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
		], function( err ) {
			if ( err )
				console.log( err );
		} );

	}
}

Commands[ "loading" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var progress = 0;
		var currentMessage;
		var bars = 20;

		function getM() {
			var before = progress;
			var after = bars - progress;
			var ret = "";
			for ( x = 0; x < before; x++ ) {
				ret += "-";
			}
			ret += "**#**";
			for ( y = 0; y < after; y++ ) {
				ret += "-";
			}
			return ret;
		}

		function doProg() {
			if ( progress === ( bars + 1 ) ) {
				progress = 0;
			}

			if ( currentMessage ) {
				bot.updateMessage( currentMessage, getM(), function( err, msg ) {
					if ( !err )
						currentMessage = msg;
				} );
				progress++;
			}

		}

		bot.sendMessage( message.channel, getM(), function( err, message ) {
			currentMessage = message;
			setInterval( doProg, 200 );
		} );

	}
}

Commands[ "flashy" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var phase = 0;
		var msg;

		var textToSay = getKey( params, "m", "FLASH" );
		var speed = parseInt( getKey( params, "s", "500" ) );

		function change() {
			if ( msg ) {

				var highlighting = ( ( phase % 2 ) === 0 ? "**" : "" );
				phase++;
				bot.updateMessage( msg, highlighting + textToSay + highlighting, function( err, message ) {
					if ( !err ) {
						msg = message;
					}
				} );
			}
		}

		bot.sendMessage( message.channel, textToSay, function( err, message ) {
			msg = message;
			setInterval( change, speed );
		} );

	}
}

Commands[ "echo" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		bot.sendMessage( message, params.join( " " ), function( err, msg ) {
			if ( err ) {
				bot.sendMessage( message, "Unable to echo!" );
				console.log( err );
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
									message,
									"Done! " + deletedCount + " message(s) were deleted, with " + failedCount + " error(s).",
									false, {
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

Commands[ "feedback" ] = {

	oplevel: 0,
	fn: function( bot, params, message ) {

		var amount = getKey( params, "amount" ) || getKey( params, "n" ) || 1000;

		bot.getChannelLogs( message.channel, amount, function( err, logs ) {

			console.log( logs );

			if ( err ) {
				bot.reply( message, "an error occurred when grabbing the logs.", false, {
					selfDestruct: 3000
				} );
			} else {

				var found = [];
				for ( msg of logs.contents ) {

					if ( ~msg.content.indexOf( "[request" ) || ~msg.content.indexOf( "[feature" || ~msg.content.indexOf( "[suggestion" ) ) ) {
						if ( msg.content.length > 10 ) {
							found.push( msg );
						}
					}

				}

				bot.sendMessage( message.author, "Ok, here's a rundown of all feature requests so far:", function( err, ms ) {

					if ( !err )
						gothroughit();

				} );

				bot.reply( message, "I found " + found.length + " result(s) that matched this. I'll send it to you in a PM.", false, {
					selfDestruct: 3000
				} );

				function gothroughit() {
					for ( msg of found ) {

						bot.sendMessage( message.author, "**" + msg.author.username + "** said:\n    " + msg.content );

					}
				}
			}
		} );

	}

}

Commands[ "acceptinvite" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var inv = getKey(params, "i");

		bot.joinServer(inv, function(err, server){
			if(err){
				bot.reply(message, "I couldn't join that server :(");
			}else{
				bot.reply(message, "I joined **"+ server.name +"**, a server with "+server.channels.length()+" channels and "+server.members.length()+" members.");
			}
		});

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

Commands[ "annoy" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var user = getUser( message, params );

		bot.sendMessage( user, "Ha I'm annoying you on " + message.author.mention() + "'s request!" );

	}
}

Commands[ "activity" ] = {
	oplevel: 0,
	fn: function( bot, params, message ) {

		var amount = getKey( params, "amount" ) || getKey( params, "n" ) || 250;
		var limit = getKey( params, "limit" ) || getKey( params, "l" ) || 10;

		bot.getChannelLogs( message.channel, amount, function( err, logs ) {

			if ( err ) {
				bot.reply( message, "error gettings logs." );
			} else {

				var activity = {},
					count = 0;
				for ( msg of logs.contents ) {

					count = logs.length();

					if ( !activity[ msg.author.id ] )
						activity[ msg.author.id ] = 0;
					activity[ msg.author.id ]++;
				}

				var report = "here's a list of activity over the last " + count + " messages :\n\n";

				var usernames = {};
				for ( id in activity ) {
					usernames[ id ] = bot.getUser( id ).username;
				}

				for ( id in activity ) {
					report += usernames[ id ] + " | " + activity[ id ] + " | **" + Math.round( ( activity[ id ] / count ) * 100 ) + "%**.\n";
				}

				bot.reply( message, report, false, false );
			}

		} );

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
