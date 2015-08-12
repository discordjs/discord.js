var request = require( "superagent" );
var Endpoints = require( "./lib/endpoints.js" );
var Server = require( "./lib/server.js" ).Server;
var Message = require( "./lib/message.js" ).Message;
var User = require( "./lib/user.js" ).User;
var Channel = require( "./lib/channel.js" ).Channel;
var List = require( "./lib/list.js" ).List;
var Invite = require( "./lib/invite.js" ).Invite;
var WebSocket = require( 'ws' );

exports.Client = function( options ) {

	this.options = options || {};
	this.token = "";
	this.loggedIn = false;
	this.websocket = null;
	this.events = {};
	this.user = null;

	this.serverList = new List( "id" );

}

exports.Client.prototype.triggerEvent = function( event, args ) {

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

	if ( this.serverList.filter( "id", id ).length > 0 ) {
		return;
	}

	var self = this;

	request
		.get( Endpoints.SERVERS + "/" + id )
		.set( "authorization", this.token )
		.end( function( err, res ) {
			var dat = res.body;
			var server = new Server( dat.region, dat.owner_id, dat.name, dat.roles[ 0 ].id, members || dat.members );

			request
				.get( Endpoints.SERVERS + "/" + id + "/channels" )
				.set( "authorization", self.token )
				.end( function( err, res ) {

					var channelList = res.body;
					for ( channel of channelList ) {
						server.channels.add( new Channel( channel, server ) );
					}

					self.serverList.add( server );

					cb( server );
				} );
		} );

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
			if ( !res.ok ) {
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

		var dat = JSON.parse( e.data );
		switch ( dat.op ) {

			case 0:
				if ( dat.t === "READY" ) {

					var data = dat.d;

					self = this;
					setInterval( function() {
						self.keepAlive.apply( self );
					}, data.heartbeat_interval );

					var _servers = data.guilds,
						servers = [];

					var cached = 0,
						toCache = _servers.length;

					for ( x in _servers ) {
						_server = _servers[ x ];
						client.cacheServer( _server.roles[ 0 ].id, function( server ) {
							cached++;
							if ( cached >= toCache ) {
								client.triggerEvent( "ready" );
							}
						}, _server.members );
					}

					client.user = new User( data.user );
				} else if ( dat.t === "MESSAGE_CREATE" ) {
					var data = dat.d;

					var channel = client.channelFromId( data.channel_id );

					var message = new Message( data, channel );

					client.triggerEvent( "message", [ message ] );

				} else if ( dat.t === "PRESENCE_UPDATE" ) {

					var data = dat.d;

					client.triggerEvent( "presence", [ new User( data.user ), data.status, client.serverList.filter( "id", data.guild_id, true ) ] );

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
			if ( !res.ok ) {
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
			if ( !res.ok ) {
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
			if ( !res.ok ) {
				cb( err );
			} else {
				cb( false, new Invite( res.body ) );
			}
		} )

}

exports.Client.prototype.sendMessage = function( channel, message, cb, _mentions, options ) {

	options = options || {};

	var cb = cb || function() {};

	if ( _mentions === false ) {
		//mentions is false, explicitly don't want to mention someone
		_mentions = [];
	} else if ( _mentions === true || _mentions === "auto" || _mentions == null || _mentions == undefined ) {
		//want to auto sort mentions
		_mentions = [];
		var mentionsArray = message.match( /<[^>]*>/g ) || [];
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
			cb( msg );
		} );
}

exports.Client.prototype.deleteMessage = function( message ) {

	if ( !message )
		return false;

	var client = this;

	request
		.del( Endpoints.CHANNELS + "/" + message.channel.id + "/messages/" + message.id )
		.set( "authorization", client.token )
		.end();
}

exports.Client.prototype.channelFromId = function( id ) {
	var channelList = this.serverList.concatSublists( "channels", "id" );
	var channel = channelList.filter( "id", id, true );

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
				cb( new List( "id" ) );
				return;
			}

			var datList = new List( "id" );

			for ( item of res.body ) {
				datList.add( new Message( item, channel ) );
			}

			cb( datList );
		} );
}
