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
var Internal = require( "./lib/internal.js" ).Internal;

/**
 * The wrapper module for the Discord Client, also provides some helpful objects.
 *
 * @module Discord
 */
exports;

exports.Endpoints = Endpoints;
exports.Server = Server;
exports.Message = Message;
exports.User = User;
exports.Channel = Channel;
exports.List = List;
exports.Invite = Invite;
exports.PMChannel = PMChannel;

/**
 * The Discord Client used to interface with the Discord API. Instantiate this to start writing code
 * with discord.js
 * @class Client
 * @constructor
 * @param {Object} [options] An object containing configurable options.
 * @param {Number} [options.maxmessage=5000] The maximum amount of messages to be stored per channel.
 */
exports.Client = function( options ) {

	/**
	 * Contains the options of the client
	 * @attribute options
	 * @type {Object}
	 */
	this.options = options || {};
	this.options.maxmessage = 5000;
	/**
	 * Contains the token used to authorise HTTP requests and WebSocket connection. Received when login was successful.
	 * @attribute token
	 * @readonly
	 * @type {String}
	 */
	this.token = "";
	/**
	 * Indicates whether the client is logged in or not. Does not indicate whether the client is ready.
	 * @attribute loggedIn
	 * @readonly
	 * @type {Boolean}
	 */
	this.loggedIn = false;
	/**
	 * The WebSocket used when receiving message and other event updates.
	 * @type {WebSocket}
	 * @attribute websocket
	 * @readonly
	 */
	this.websocket = null;
	/**
	 * An Object containing the functions tied to events. These should be set using Client.on();
	 * @type {Object}
	 * @attribute events
	 */
	this.events = {};
	/**
	 * The User of the Client class, set when the initial startup is complete.
	 * @attribute user
	 * @type {User}
	 * @readonly
	 */
	this.user = null;
	/**
	 * Indicates whether the Client is ready and has cached all servers it as aware of.
	 * @type {Boolean}
	 * @attribute ready
	 * @readonly
	 */
	this.ready = false;
	/**
	 * A List containing all the Servers the Client has access to.
	 * @attribute serverList
	 * @type {List}
	 * @readonly
	 */
	this.serverList = new List( "id" );
	/**
	 * A List containing all the PMChannels the Client has access to.
	 * @attribute PMList
	 * @type {List}
	 * @readonly
	 */
	this.PMList = new List( "id" );

}

/**
 * Returns a list of all servers that the Discord Client has access to.
 *
 * @method getServers
 * @return {List} ServerList
 */
exports.Client.prototype.getServers = function() {
	return this.serverList;
}

/**
 * Returns a list of all servers that the Discord Client has access to.
 * @method getChannels
 * @return {List} Channelist
 */
exports.Client.prototype.getChannels = function() {
	return this.serverList.concatSublists( "channels", "id" );
}

/**
 * Returns a Server matching the given id, or false if not found. Will return false if the server is not cached or not available.
 * @method getServer
 * @param  {String/Number} id The ID of the Server
 * @return {Server} The Server matching the ID
 */
exports.Client.prototype.getServer = function( id ) {
	return this.getServers().filter( "id", id, true );
}

/**
 * Returns a Channel matching the given id, or false if not found. Will return false if the Channel is not cached or not available.
 * @method getChannel
 * @param  {String/Number} id The ID of the Channel
 * @return {Server} The Channel matching the ID
 */
exports.Client.prototype.getChannel = function( id ) {
	return this.getChannels().filter( "id", id, true );
}

/**
 * Triggers an .on() event.
 * @param  {String} event The event to be triggered
 * @param  {Array} args The arguments to be passed onto the method
 * @return {Boolean} whether the event was triggered successfully.
 * @method triggerEvent
 * @private
 */
exports.Client.prototype.triggerEvent = function( event, args ) {

	if ( !this.ready && event !== "raw" && event !== "disconnected" && event !== "debug" ) { //if we're not even loaded yet, don't try doing anything because it always ends badly!
		return false;
	}

	if ( this.events[ event ] ) {
		this.events[ event ].apply( this, args );
		return true;
	} else {
		return false;
	}

}

/**
 * Binds a function to an event
 * @param  {String} name The event name which the function should be bound to.
 * @param  {Function} fn The function that should be bound to the event.
 * @method on
 */
exports.Client.prototype.on = function( name, fn ) {
	this.events[ name ] = fn;
}

/**
 * Unbinds a function from an event
 * @param  {String} name The event name which should be cleared
 * @method off
 */
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

		Internal.XHR.getServer( self.token, id, function( err, data ) {
			if ( !err ) {
				makeServer( data );
			}
		} )

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
		Internal.XHR.getChannel( self.token, id, function( err ) {
			if ( !err )
				cacheChannels( res.body );
		} )
	}

	var server;

	function makeServer( dat ) {
		server = new Server( dat.region, dat.owner_id, dat.name, id, serverInput.members || dat.members, dat.icon, dat.afk_timeout, dat.afk_channel_id );
		if ( dat.channels )
			cacheChannels( dat.channels );
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

/**
 * Logs the Client in with the specified credentials and begins initialising it.
 * @async
 * @method login
 * @param  {String} email The Discord email.
 * @param  {String} password The Discord password.
 * @param  {Function} [callback] Called when received reply from authentication server.
 * @param {Object} callback.error Set to null if there was no error logging in, otherwise is an Object that
 * can be evaluated as true.
 * @param {String} callback.error.reason The reason why there was an error
 * @param {Object} callback.error.error The raw XHR error.
 * @param {String} callback.token The token received when logging in
 */
exports.Client.prototype.login = function( email, password, callback ) {

	var self = this;
	callback = callback || function() {};

	self.connectWebsocket();

	var time = Date.now();
	Internal.XHR.login( email, password, function( err, token ) {
		console.log( Date.now() - time );
		if ( err ) {
			self.triggerEvent( "disconnected", [ {
				reason: "failed to log in",
				error: err
			} ] );
			self.websocket.close();
		} else {
			self.token = token;
			self.websocket.sendData();
			self.loggedIn = true;
			callback( null, token );
		}

	} );
}

/**
 * Replies to a message with a given message
 * @param  {Message/User/Channel/Server/String} destination Where the message should be sent. Channel IDs can also be used here.
 * @param  {String/Message/Array} toSend If a message, the message's content will be sent. If an array, a message will be sent of
 * the array seperated by a newline. If a String, the string will be sent.
 * @param  {Function} callback Called when a response from the API has been received, the message has either been sent or not.
 * @param {Object} callback.error If there was an error, this would be an XHR Error object. Otherwise, it will be null.
 * @param {Message} callback.message If there were no errors, this will be the sent message in Message form.
 * @param  {Object} options see sendMessage(options)
 * @method reply
 */
exports.Client.prototype.reply = function( destination, toSend, callback, options ) {

	if ( toSend instanceof Array ) {
		toSend = toSend.join( "\n" );
	}

	toSend = destination.author.mention() + ", " + toSend;

	this.sendMessage( destination, toSend, callback, options );

}

exports.Client.prototype.connectWebsocket = function( cb ) {

	var self = this;

	var sentInitData = false;

	this.websocket = new WebSocket( Endpoints.WEBSOCKET_HUB );
	this.websocket.onclose = function( e ) {
		self.triggerEvent( "disconnected", [ {
			reason: "websocket disconnected",
			error: e
		} ] );
	};
	this.websocket.onmessage = function( e ) {

		self.triggerEvent( "raw", [ e ] );

		var dat = JSON.parse( e.data );
		var webself = this;

		switch ( dat.op ) {

			case 0:
				if ( dat.t === "READY" ) {

					var data = dat.d;

					setInterval( function() {
						webself.keepAlive.apply( webself );
					}, data.heartbeat_interval );

					self.user = new User( data.user );

					var _servers = data.guilds,
						servers = [];

					var cached = 0,
						toCache = _servers.length;

					for ( x in data.private_channels ) {
						self.PMList.add( new PMChannel( data.private_channels[ x ].recipient, data.private_channels[ x ].id ) );
					}

					for ( x in _servers ) {
						_server = _servers[ x ];

						self.cacheServer( _server, function( server ) {
							cached++;
							if ( cached === toCache ) {
								self.ready = true;
								self.triggerEvent( "ready" );
							}
						} );
					}

				} else if ( dat.t === "MESSAGE_CREATE" ) {
					var data = dat.d;

					var channel = self.getChannel( data.channel_id );
					var message = new Message( data, channel );
					self.triggerEvent( "message", [ message ] );
					if ( channel.messages )
						channel.messages.add( message );

				} else if ( dat.t === "MESSAGE_DELETE" ) {
					var data = dat.d;

					var channel = self.getChannel( data.channel_id );

					if ( !channel.messages )
						return;

					var _msg = channel.messages.filter( "id", data.id, true );

					if ( _msg ) {
						self.triggerEvent( "messageDelete", [ _msg ] );
						channel.messages.removeElement( _msg );
					}

				} else if ( dat.t === "MESSAGE_UPDATE" ) {

					var data = dat.d;
					if ( !self.ready )
						return;

					var formerMessage = false;

					var channel = self.getChannel( data.channel_id );

					if ( channel ) {

						formerMessage = channel.messages.filter( "id", data.id, true );
						var newMessage;

						data.author = data.author || formerMessage.author;
						data.timestamp = data.time || formerMessage.time;
						data.content = data.content || formerMessage.content;
						data.channel = data.channel || formerMessage.channel;
						data.id = data.id || formerMessage.id;
						data.mentions = data.mentions || formerMessage.mentions;
						data.mention_everyone = data.mention_everyone || formerMessage.everyoneMentioned;

						newMessage = new Message( data, channel );

						self.triggerEvent( "messageUpdate", [ formerMessage, newMessage ] );

						if ( formerMessage )
							channel.messages.updateElement( formerMessage, newMessage );
						else
							channel.messages.add( newMessage );

					}

				} else if ( dat.t === "PRESENCE_UPDATE" ) {

					var data = dat.d;

					self.triggerEvent( "presence", [ new User( data.user ), data.status, self.serverList.filter( "id", data.guild_id, true ) ] );

				} else if ( dat.t === "GUILD_DELETE" ) {

					var deletedServer = self.serverList.filter( "id", dat.d.id, true );

					if ( deletedServer ) {
						self.triggerEvent( "serverDelete", [ deletedServer ] );
					}

				} else if ( dat.t === "CHANNEL_DELETE" ) {

					var delServer = self.serverList.filter( "id", dat.d.guild_id, true );

					if ( delServer ) {
						var channel = delServer.channels.filter( "id", dat.d.id, true );

						if ( channel ) {
							self.triggerEvent( "channelDelete", [ channel ] );
						}
					}

				} else if ( dat.t === "GUILD_CREATE" ) {

					if ( !self.serverList.filter( "id", dat.d.id, true ) ) {
						self.cacheServer( dat.d, function( server ) {
							self.triggerEvent( "serverJoin", [ server ] );
						} );
					}

				} else if ( dat.t === "CHANNEL_CREATE" ) {

					var srv = self.serverList.filter( "id", dat.d.guild_id, true );

					if ( srv ) {

						if ( !srv.channels.filter( "id", dat.d.d, true ) ) {

							var chann = new Channel( dat.d, srv );

							srv.channels.add( new Channel( dat.d, srv ) );
							self.triggerEvent( "channelCreate", [ chann ] );

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

		this.sendData( "onopen" );

	}
	this.websocket.sendData = function( why ) {
		if ( this.readyState == 1 && !sentInitData && self.token ) {
			sentInitData = true;
			var connDat = {
				op: 2,
				d: {
					token: self.token,
					v: 2
				}
			};

			connDat.d.properties = Internal.WebSocket.properties;
			this.sendPacket( connDat );
		}
	}
}

/**
 * Logs the current Client out of Discord and closes any connections.
 * @param  {Function} callback Called after a response is obtained.
 * @param {Object} callback.error Null unless there was an error, in which case is an XHR error.
 * @method logout
 */
exports.Client.prototype.logout = function( callback ) {

	callback = callback || function() {};

	var self = this;

	Internal.XHR.logout( self.token, function( err ) {
		if ( err ) {
			callback( err );
		}
		self.loggedIn = false;
		self.websocket.close();
	} );

}

/**
 * Creates a server with the specified name and region and returns it
 * @param  {String} name The name of the server
 * @param  {String} region The region of the server
 * @param  {Function} callback Called when the request is made.
 * @param {Object} callback.error An XHR error or null if there were no errors.
 * @param {Server} callback.server A Server object representing the created server.
 * @method createServer
 * @async
 */
exports.Client.prototype.createServer = function( name, region, cb ) {

	var self = this;

	Internal.XHR.createServer( self.token, name, region, function( err, data ) {

		if ( err ) {
			cb( err );
		} else {

			self.cacheServer( data, function( server ) {
				cb( null, server );
			} );

		}

	} );

}

/**
 * Makes the Client leave the Server
 * @param  {Server} server A server object. The server you want to leave.
 * @param  {Function} callback Called when the leave request is made.
 * @param {Object} callback.error An XHR error or null if there were no errors.
 * @param {Server} callback.server A Server object representing the deleted server.
 * @method leaveServer
 * @async
 */
exports.Client.prototype.leaveServer = function( server, callback ) {

	var self = this;

	// callback is not necessary for this function
	callback = callback || function() {};

	Internal.XHR.leaveServer( self.token, server.id, function( err ) {

		if ( err ) {
			callback( err );
		} else {
			self.serverList.removeElement( server );
			callback( null, server );
		}

	} );

}

/**
 * Creates an Invite to the specified channel/server with the specified options
 * @param  {Channel/Server} channel The channel/server the invite is to be made to.
 * @param  {Object} [options] The options for the invite
 * @param {Number} [options.max_age=0] When the invite will expire in seconds
 * @param {Number} [options.max_uses=0] How many uses the invite has
 * @param {Boolean} [options.temporary=false] Whether the invite is temporary
 * @param {Boolean} [options.xkcdpass=false] Whether the invite's code should be composed of words.
 * @param  {Function} callback Called when the invite request has been made
 * @param {Object} callback.error An XHR Error or null if there were no errors.
 * @param {Invite} callback.invite An invite object representing the created invite.
 * @method createInvite
 */
exports.Client.prototype.createInvite = function( channel, options, callback ) {

	var self = this;
	var options = options || {};

	// callback is not necessary for this function
	callback = callback || function() {};

	if ( channel instanceof Server ) {
		channel = channel.getDefaultChannel();
	}

	options.max_age = options.max_age || 0;
	options.max_uses = options.max_uses || 0;
	options.temporary = options.temporary || false;
	options.xkcdpass = options.xkcd || false;

	Internal.XHR.createInvite( self.token, channel.id, options, function( err, data ) {

		if ( err ) {
			callback( err );
		} else {
			callback( null, new Invite( data ) );
		}

	} );

}

exports.Client.prototype.startPM = function( user, callback ) {

	var self = this;

	callback = callback || function() {};

	Internal.XHR.startPM( self.token, self.user.id, user.id, function( err, data ) {

		if ( err ) {
			callback( err );
		} else {
			var channel = new PMChannel( data.recipient, data.id );
			self.PMList.add( channel );
			callback( null, channel );
		}

	} );

}

/**
 * Sends a message to the specified destination.
 * @param  {Server/Channel/PMChannel/Message/User/String} destination Where the message should be sent. If this is a String, the String should be a channel ID.
 * @param  {String/Array/Message} toSend The message to send. If an array, the array will be seperated into new lines and then sent.
 * @param  {Function} callback Called when the message has been sent.
 * @param {Object} error An XHR Error or null if there were no errors.
 * @param {Message} message A message object representing the sent object.
 * @param  {Object} [options] An object containing options for the message.
 * @param {Array/Boolean/String} [options.mentions=true] If an Array, it should be an array of User IDs. If a boolean, false will
 * notify no-one, and true will figure out who should be mentioned based on the message. If a String, should be a User
 * ID.
 * @param {Number} [options.selfDestruct=false] If specified, should be the amount of milliseconds at which the message should
 * delete itself after being sent.
 * @method sendMessage
 */
exports.Client.prototype.sendMessage = function( destination, toSend, callback, options ) {

	options = options || {};
	callback = callback || function() {};

	var channel_id, message, mentions, self = this;

	channel_id = resolveChannel( destination, self );
	message = resolveMessage( toSend );
	mentions = resolveMentions( message, options.mention );

	if ( channel_id ) {
		send();
	} else {
		//a channel is being sorted
	}

	function send() {

		Internal.XHR.sendMessage( self.token, channel_id, {
			content: message,
			mentions: mentions
		}, function( err, data ) {
			if ( err ) {
				callback( err );
			} else {
				var msg = new Message( data, self.getChannel( data.channel_id ) );
				if ( options.selfDestruct ) {
					setTimeout( function() {
						self.deleteMessage( msg );
					}, options.selfDestruct );
				}
				callback( null, msg );
			}
		} );
	}

	function setChannId( id ) {
		channel_id = id;
	}

	function resolveChannel( destination, self ) {
		var channel_id = false;
		if ( destination instanceof Server ) {
			channel_id = destination.getDefaultChannel().id;
		} else if ( destination instanceof Channel ) {
			channel_id = destination.id;
		} else if ( destination instanceof PMChannel ) {
			channel_id = destination.id;
		} else if ( destination instanceof Message ) {
			channel_id = destination.channel.id;
		} else if ( destination instanceof User ) {
			var destId = self.PMList.deepFilter( [ "user", "id" ], destination.id, true );

			if ( destId ) {
				channel_id = destId.id;
			} else {
				//start a PM and then get that use that
				self.startPM( destination, function( err, channel ) {
					if ( err ) {
						callback( err );
					} else {
						self.PMList.add( new PMChannel( channel.recipient, channel.id ) );
						setChannId( channel.id );
						send();
					}
				} );
				return false;
			}
		} else {
			channel_id = destination;
		}
		return channel_id;
	}

	function resolveMessage( toSend ) {
		var message;
		if ( typeof toSend === "string" || toSend instanceof String )
			message = toSend;
		else if ( toSend instanceof Array )
			message = toSend.join( "\n" );
		else if ( toSend instanceof Message )
			message = toSend.content;
		else
			message = toSend;
		return message.substring( 0, 2000 );
	}

	function resolveMentions( message, mentionsOpt ) {
		var mentions = [];
		if ( mentionsOpt === false ) {} else if ( mentionsOpt || mentionsOpt === "auto" || mentionsOpt == null || mentionsOpt == undefined ) {
			for ( mention of( message.match( /<@[^>]*>/g ) || [] ) ) {
				mentions.push( mention.substring( 2, mention.length - 1 ) );
			}
		} else if ( mentionsOpt instanceof Array ) {
			for ( mention of mentionsOpt ) {
				if ( mention instanceof User ) {
					mentions.push( mention.id );
				} else {
					mentions.push( mention );
				}
			}
		}
		return mentions;
	}
}

/**
 * Deletes the specified message if the bot has authority
 * @param {Message} message The message to delete
 * @param  {Function} callback Called after the message deletion request is sent.
 * @param {Object} callback.error If there was an error, this would be an XHR Error object. Otherwise, it will be null.
 * @param {Message} callback.message A message object representing the deleted object.
 * @method deleteMessage
 */
exports.Client.prototype.deleteMessage = function( message, callback ) {
	callback = callback || function() {};

	var self = this;

	Internal.XHR.deleteMessage( self.token, message.channel.id, message.id, callback );
}

exports.Client.prototype.updateMessage = function( oldMessage, newContent, callback, options ) {

	var self = this;
	var channel = oldMessage.channel;
	options = options || {};

	Internal.XHR.updateMessage( self.token, channel.id, oldMessage.id, {
		content: newContent,
		mentions: []
	}, function( err, data ) {
		if ( err ) {
			callback( err );
			return;
		}
		var msg = new Message( data, self.getChannel( data.channel_id ) );
		if ( options.selfDestruct ) {
			setTimeout( function() {
				self.deleteMessage( msg );
			}, options.selfDestruct );
		}
		callback( null, msg );
	} );

}

exports.Client.prototype.getChannelLogs = function( channel, amount, callback ) {
	var self = this;

	Internal.XHR.getChannelLogs( self.token, channel.id, ( amount || 50 ), function( err, data ) {

		if ( err ) {
			callback( err );
			return;
		}

		var logs = new List( "id" );
		for ( message of data ) {
			logs.add( new Message( message, channel ) );
		}
		callback( null, logs );

	} );
}

exports.Client.prototype.createChannel = function( server, name, type, callback ) {

	var self = this;

	Internal.XHR.createChannel( self.token, server.id, name, type, function( err, data ) {

		if ( err ) {
			callback( err );
		} else {
			var chann = new Channel( data, server );
			server.channels.add( chann );
			callback( null, chann );
		}

	} );
}

exports.Client.prototype.deleteChannel = function( channel, callback ) {
	var self = this;

	Internal.XHR.deleteChannel( self.token, channel.id, function( err ) {

		channel.server.channels.removeElement( channel );
		self.triggerEvent( "channelDelete", [ channel ] );
		callback( null );

	} );
}

exports.Client.prototype.deleteServer = function( server, callback ) {

	var self = this;

	Internal.XHR.deleteServer( self.token, server.id, function( err ) {

		self.serverList.removeElement( server );
		self.triggerEvent( "serverDelete", [ server ] );
		callback( null );

	} );

}

exports.Client.prototype.getServers = function() {
	return this.serverList;
}

exports.Client.prototype.getChannels = function() {
	return this.serverList.concatSublists( "channels", "id" );
}

exports.Client.prototype.getUsers = function() {
	return this.getServers().concatSublists( "members", "id" );
}

exports.Client.prototype.getServer = function( id ) {
	return this.getServers().filter( "id", id, true );
}

exports.Client.prototype.getChannel = function( id ) {
	return this.getChannels().filter( "id", id, true );
}

exports.Client.prototype.getUser = function( id ) {
	return this.getUsers().filter( "id", id, true );
}

exports.isUserID = function( id ) {
	return ( ( id + "" ).length === 17 && !isNaN( id ) );
}

exports.Client.prototype.addPM = function( pm ) {
	this.PMList.add( pm );
}
