var request = require( "superagent" );
var Endpoints = require( "./lib/endpoints.js" );
var Server = require( "./lib/server.js" ).Server;
var Message = require( "./lib/message.js" ).Message;
var User = require( "./lib/user.js" ).User;
var Channel = require( "./lib/channel.js" ).Channel;
var List = require( "./lib/list.js" ).List;
var Invite = require( "./lib/invite.js" ).Invite;
var PMChannel = require( "./lib/PMChannel.js" ).PMChannel;
var WebSocket = require( 'ws' );

exports.Endpoints = Endpoints;
exports.Server = Server;
exports.Message = Message;
exports.User = User;
exports.Channel = Channel;
exports.List = List;
exports.Invite = Invite;
exports.PMChannel = PMChannel;

exports.isUserID = function( id ) {
	return ( ( id + "" ).length === 17 && !isNaN( id ) );
}

exports.Client = function( options ) {

	this.options = options || {};
	this.token = "";
	this.loggedIn = false;
	this.websocket = null;
	this.events = {};
	this.user = null;
	this.ready = false;
	this.serverList = new List( "id" );
	this.PMList = new List( "id" );

}

exports.Client.prototype.triggerEvent = function( event, args ) {

	if ( !this.ready && event !== "raw" && event !== "disconnected" ) { //if we're not even loaded yet, don't try doing anything because it always ends badly!
		return;
	}

	if ( this.events[ event ] ) {
		this.events[ event ].apply( this, args );
	} else {
		return false;
	}

}

exports.Client.prototype.on = function( name, fn ) {
	this.events[ name ] = fn;
}

exports.Client.prototype.off = function( name ) {
	this.events[ name ] = function() {};
}

exports.Client.prototype.cacheServer = function( id, cb, members ) {
	var self = this;
	var serverInput = {};

	if ( typeof id === 'string' || id instanceof String ) {
		//actually an ID

		if ( this.serverList.filter( "id", id ).length > 0 ) {
			return;
		}

		request
			.get( Endpoints.SERVERS + "/" + id )
			.set( "authorization", self.token )
			.end( function( err, res ) {

				if ( err ) {
					throw err;
				}

				var dat = res.body;

				makeServer( dat );

			} );

	} else {
		// got objects because SPEEEDDDD

		if ( this.serverList.filter( "id", id.id ).length > 0 ) {
			return;
		}
		serverInput = id;
		id = id.id;
		makeServer( serverInput );

	}

	function channelsFromHTTP() {
		request
			.get( Endpoints.SERVERS + "/" + id + "/channels" )
			.set( "authorization", self.token )
			.end( function( err, res ) {
				if ( err )
					throw err;

				cacheChannels( res.body );
			} );
	}

	var server;

	function makeServer( dat ) {
		server = new Server( dat.region, dat.owner_id, dat.name, id, serverInput.members || dat.members, dat.icon, dat.afk_timeout, dat.afk_channel_id );
		if ( dat.channels )
			cacheChannels(dat.channels);
		else
			channelsFromHTTP();
	}

	function cacheChannels( dat ) {

		var channelList = dat;
		for ( channel of channelList ) {
			server.channels.add( new Channel( channel, server ) );
		}

		self.serverList.add( server );

		cb( server );
	}

}

exports.Client.prototype.login = function( email, password ) {

	var client = this;

	var details = {
		email: email,
		password: password
	};

	request
		.post( Endpoints.LOGIN )
		.send( details )
		.end( function( err, res ) {
			if ( err ) {
				client.triggerEvent( "disconnected", [ {
					reason: "failed to log in",
					error: err
				} ] );
			} else {
				client.token = res.body.token;
				client.loggedIn = true;
				client.connectWebsocket();
			}
		} );

}

exports.Client.prototype.reply = function() {

	if ( arguments[ 1 ] instanceof Array ) {
		arguments[ 1 ] = arguments[ 1 ].join( "\n" );
	}

	arguments[ 1 ] = arguments[ 0 ].author.mention() + ", " + arguments[ 1 ];

	this.sendMessage.apply( this, arguments );

}

exports.Client.prototype.connectWebsocket = function( cb ) {

	var client = this;

	this.websocket = new WebSocket( Endpoints.WEBSOCKET_HUB );
	this.websocket.onclose = function( e ) {
		client.triggerEvent( "disconnected", [ {
			reason: "websocket disconnected",
			error: e
		} ] );
	};
	this.websocket.onmessage = function( e ) {

		client.triggerEvent( "raw", [ e ] );

		var dat = JSON.parse( e.data );
		switch ( dat.op ) {

			case 0:
				if ( dat.t === "READY" ) {

					var data = dat.d;

					self = this;
					setInterval( function() {
						self.keepAlive.apply( self );
					}, data.heartbeat_interval );

					client.user = new User( data.user );

					var _servers = data.guilds,
						servers = [];

					var cached = 0,
						toCache = _servers.length;

					for ( x in _servers ) {
						_server = _servers[ x ];

						client.cacheServer( _server, function( server ) {
							cached++;
							if ( cached >= toCache ) {
								client.ready = true;
								client.triggerEvent( "ready" );
							}
						} );
					}

					for ( x in data.private_channels ) {
						client.PMList.add( new PMChannel( data.private_channels[ x ].recipient, data.private_channels[ x ].id ) );
					}

				} else if ( dat.t === "MESSAGE_CREATE" ) {
					var data = dat.d;

					var channel = client.channelFromId( data.channel_id );

					var message = new Message( data, channel );

					client.triggerEvent( "message", [ message ] );

				} else if ( dat.t === "PRESENCE_UPDATE" ) {

					var data = dat.d;

					client.triggerEvent( "presence", [ new User( data.user ), data.status, client.serverList.filter( "id", data.guild_id, true ) ] );

				} else if ( dat.t === "GUILD_DELETE" ) {

					var deletedServer = client.serverList.filter( "id", dat.d.id, true );

					if ( deletedServer ) {
						client.triggerEvent( "serverDelete", [ deletedServer ] );
					}

				} else if ( dat.t === "CHANNEL_DELETE" ) {

					var delServer = client.serverList.filter( "id", dat.d.guild_id, true );

					if ( delServer ) {
						var channel = delServer.channels.filter( "id", dat.d.id, true );

						if ( channel ) {
							client.triggerEvent( "channelDelete", [ channel ] );
						}
					}

				} else if ( dat.t === "GUILD_CREATE" ) {

					if ( !client.serverList.filter( "id", dat.d.id, true ) ) {
						client.cacheServer( dat.d, function( server ) {
							client.triggerEvent( "serverJoin", [ server ] );
						});
					}

				} else if ( dat.t === "CHANNEL_CREATE" ) {

					var srv = client.serverList.filter( "id", dat.d.guild_id, true );

					if ( srv ) {

						if ( !srv.channels.filter( "id", dat.d.d, true ) ) {

							var chann = new Channel( dat.d, srv );

							srv.channels.add( new Channel( dat.d, srv ) );
							client.triggerEvent( "channelCreate", [ chann ] );

						}

					}

				}
				break;

		}

	};
	this.websocket.sendPacket = function( p ) {
		this.send( JSON.stringify( p ) );
	}
	this.websocket.keepAlive = function() {

		if ( this.readyState !== 1 )
			return false;

		this.sendPacket( {
			op: 1,
			d: Date.now()
		} );

	}
	this.websocket.onopen = function() {

		var connDat = {
			op: 2,
			d: {
				token: client.token,
				v: 2
			}
		};

		connDat.d.properties = {
			"$os": "discord.js",
			"$browser": "discord.js",
			"$device": "discord.js",
			"$referrer": "",
			"$referring_domain": ""
		};

		this.sendPacket( connDat );
	}
}

exports.Client.prototype.logout = function() {

	var client = this;

	request
		.post( Endpoints.LOGOUT )
		.end( function() {
			client.loggedIn = false;
		} );

}

exports.Client.prototype.createServer = function( _name, _region, cb ) {

	var client = this;

	var details = {
		name: _name,
		region: _region
	};

	request
		.post( Endpoints.SERVERS )
		.set( "authorization", client.token )
		.send( details )
		.end( function( err, res ) {
			if ( err ) {
				cb( err );
			} else {
				client.cacheServer( res.body.id, function( server ) {

					cb( null, server );

				} );
			}
		} );

}

exports.Client.prototype.leaveServer = function( server, cb ) {

	var client = this;

	request
		.del( Endpoints.SERVERS + "/" + server.id )
		.set( "authorization", client.token )
		.end( function( err, res ) {
			if ( err ) {
				cb( err );
			} else {
				client.serverList.removeElement( server );
				cb( null );
			}
		} );

}

exports.Client.prototype.createInvite = function( channel, options, cb ) {

	var client = this;
	var options = options || {};

	if ( channel instanceof Server ) {
		channel = channel.getDefaultChannel();
	}

	options.max_age = options.max_age || 0;
	options.max_uses = options.max_uses || 0;
	options.temporary = options.temporary || false;
	options.xkcdpass = options.xkcd || false;

	request
		.post( Endpoints.CHANNELS + "/" + channel.id + "/invites" )
		.set( "authorization", client.token )
		.send( options )
		.end( function( err, res ) {
			if ( err ) {
				cb( err );
			} else {
				cb( false, new Invite( res.body ) );
			}
		} )

}

exports.Client.prototype.startPM = function( user, message, cb, _mentions, options ) {

	var client = this;

	request
		.post( Endpoints.USERS + "/" + client.user.id + "/channels" )
		.set( "authorization", client.token )
		.send( {
			recipient_id: user.id
		} )
		.end( function( err, res ) {
			if ( err ) {
				cb( err );
			} else {
				client.PMList.add( new PMChannel( res.body.recipient, res.body.id ) );
				client.sendMessage( user, message, cb, _mentions, options );
			}
		} );

}

exports.Client.prototype.sendMessage = function( channel, message, cb, _mentions, options ) {

	options = options || {};

	if ( message instanceof Array ) {
		message = message.join( "\n" );
	}

	var thisLoopId = Math.floor( Math.random() * 1000 );

	if ( channel instanceof User ) {
		if ( !this.PMList.deepFilter( [ "user", "id" ], channel.id, true ) ) {
			//user does not exist! omgomgomg
			this.startPM( channel, message, cb, _mentions, options, true );
			return;
		} else {
			channel.id = this.PMList.deepFilter( [ "user", "id" ], channel.id, true ).id;
		}
	}

	if ( channel instanceof Message ) { //if the channel is actually a message, get the channel
		channel = channel.channel;
	}

	if ( typeof channel === 'string' || channel instanceof String || !isNaN( channel ) ) {
		//Channel is an ID
		var chanId = channel;
		channel = {
			id: chanId
		}
	}

	var cb = cb || function() {};

	if ( _mentions === false ) {
		//mentions is false, explicitly don't want to mention someone
		_mentions = [];
	} else if ( _mentions === true || _mentions === "auto" || _mentions == null || _mentions == undefined ) {
		//want to auto sort mentions
		_mentions = [];
		var mentionsArray = message.match( /<@[^>]*>/g ) || [];
		for ( mention of mentionsArray ) {
			_mentions.push( mention.substring( 2, mention.length - 1 ) );
		}

	} else if ( _mentions instanceof Array ) {
		//specific mentions
		for ( mention in _mentions ) {
			_mentions[ mention ] = _mentions[ mention ].id;
		}
	} else {

	}

	var client = this;
	var details = {
		content: message.substring( 0, 2000 ),
		mentions: _mentions || []
	};

	request
		.post( Endpoints.CHANNELS + "/" + channel.id + "/messages" )
		.set( "authorization", client.token )
		.send( details )
		.end( function( err, res ) {

			if ( err ) {
				cb( err );
				return;
			}

			var msg = new Message( res.body, client.channelFromId( res.body.channel_id ) );
			if ( options.selfDestruct ) {
				setTimeout( function() {
					client.deleteMessage( msg );
				}, options.selfDestruct );
			}
			cb( null, msg );
		} );

}

exports.Client.prototype.deleteMessage = function( message, cb ) {

	if ( !message )
		return false;

	var client = this;

	request
		.del( Endpoints.CHANNELS + "/" + message.channel.id + "/messages/" + message.id )
		.set( "authorization", client.token )
		.end( cb );
}

exports.Client.prototype.channelFromId = function( id ) {
	var channelList = this.serverList.concatSublists( "channels", "id" );
	var channel = channelList.filter( "id", id, true );

	if ( !channel ) {

		channel = this.PMList.filter( "id", id, true );

	}

	return channel;
}

exports.Client.prototype.getChannelLogs = function( channel, amount, cb ) {
	amount = amount || 0;
	var client = this;

	request
		.get( Endpoints.CHANNELS + "/" + channel.id + "/messages?limit=" + amount )
		.set( "authorization", client.token )
		.end( function( err, res ) {

			if ( err ) {
				cb( err );
				return;
			}

			var datList = new List( "id" );

			for ( item of res.body ) {
				datList.add( new Message( item, channel ) );
			}

			cb( null, datList );
		} );
}

exports.Client.prototype.createChannel = function( server, serverName, serverType, cb ) {

	var client = this;

	request
		.post( Endpoints.SERVERS + "/" + server.id + "/channels" )
		.set( "authorization", client.token )
		.send( {
			name: serverName,
			type: serverType
		} )
		.end( function( err, res ) {
			if ( err ) {
				cb( err );
			} else {
				var chann = new Channel( res.body, server );
				client.serverList.filter( "id", server.id, true ).channels.add( chann );
				cb( null, chann );
			}
		} );
}

exports.Client.prototype.deleteChannel = function( channel, cb ) {

	var client = this;

	request
		.del( Endpoints.CHANNELS + "/" + channel.id )
		.set( "authorization", client.token )
		.end( function( err, res ) {
			if ( err ) {
				cb( err );
			} else {

				client.serverList.filter( "id", channel.server.id, true ).channels.removeElement( channel );

				client.triggerEvent( "channelDelete", [ channel ] );

				cb( null );
			}
		} );

}

exports.Client.prototype.deleteServer = function( server, cb ) {

	var client = this;

	request
		.del( Endpoints.SERVERS + "/" + server.id )
		.set( "authorization", client.token )
		.end( function( err, res ) {
			if ( err ) {
				cb( err );
			} else {

				client.serverList.removeElement( server );

				client.triggerEvent( "serverDelete", [ server ] );

				cb( null );
			}
		} );

}
