"use strict";

import InternalClient from "./InternalClient";
import EventEmitter from "events";
import PMChannel from "../Structures/PMChannel";

// This utility function creates an anonymous error handling wrapper function
// for a given callback. It is used to allow error handling inside the callback
// and using other means.
function errorCallback(callback) {
	return error => {
		callback(error);
		throw error;
	};
}

// This utility function creates an anonymous handler function to separate the
// error and the data arguments inside a callback and return the data if it is
// eventually done (for promise propagation).
function dataCallback(callback) {
	return data => {
		callback(null, data);
		return data;
	}
}

/**
 * Used to interface with the Discord API.
 */
export default class Client extends EventEmitter {
	/**
	 * Used to instantiate Discord.Client
	 * @param {ClientOptions} [options] options that should be passed to the Client.
	 * @example
	 * // creates a new Client that will try to reconnect whenever it is disconnected.
	 * var client = new Discord.Client({
	 *		autoReconnect : true
	 * });
	 */
	constructor(options = {}) {
		super();
		/**
		 * Options that were passed to the client when it was instantiated.
		 * @readonly
		 * @type {ClientOptions}
		 */
		this.options = options || {};
		this.options.compress = options.compress === undefined ? !process.browser : options.compress;
		this.options.autoReconnect = options.autoReconnect === undefined ? true : options.autoReconnect;
		this.options.rateLimitAsError = options.rateLimitAsError || false;
		this.options.largeThreshold = options.largeThreshold || 250;
		this.options.maxCachedMessages = options.maxCachedMessages || 1000;
		this.options.guildCreateTimeout = options.guildCreateTimeout || 1000;
		this.options.shardId = options.shardId || 0;
		this.options.shardCount = options.shardCount || 0;
		this.options.disableEveryone = options.disableEveryone || false;
		this.options.bot = options.bot === undefined || options.bot === true ? true : false;

		if (typeof options.shardCount === "number" && typeof options.shardId === "number" && options.shardCount > 0) {
			this.options.shard = [options.shardId, options.shardCount];
		}

		/**
		 * Internal Client that the Client wraps around.
		 * @readonly
		 * @type {InternalClient}
		 */
		this.internal = new InternalClient(this);
	}


	/**
	 * The users that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>} a Cache of the Users
	 * @readonly
	 * @example
	 * // log usernames of the users that the client is aware of
	 * for(var user of client.users){
	 *     console.log(user.username);
	 * }
	 */
	get users() {
		return this.internal.users;
	}

	/**
	 * The server channels the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<ServerChannel>} a Cache of the Server Channels
	 * @readonly
	 * @example
	 * // log the names of the channels and the server they belong to
	 * for(var channel of client.channels){
	 *     console.log(`${channel.name} is part of ${channel.server.name}`)
	 * }
	 */
	get channels() {
		return this.internal.channels;
	}

	/**
	 * The servers the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<Server>} a Cache of the Servers
	 * @readonly
	 * @example
	 * // log the names of the servers
	 * for(var server of client.servers){
	 *     console.log(server.name)
	 * }
	 */
	get servers() {
		return this.internal.servers;
	}

	/**
	 * The PM/DM chats the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<PMChannel>} a Cache of the PM/DM Channels.
	 * @readonly
	 * @example
	 * // log the names of the users the client is participating in a PM with
	 * for(var pm of client.privateChannels){
	 *     console.log(`Participating in a DM with ${pm.recipient}`)
	 * }
	 */
	get privateChannels() {
		return this.internal.private_channels;
	}

	/**
	 * The friends that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>|null} a Cache of friend Users (or null if bot account)
	 * @readonly
	 * @example
	 * // log names of the friends that the client is aware of
	 * for(var user of client.friends){
	 *     console.log(user.username);
	 * }
	 */
	get friends() {
		return this.internal.friends;
	}

	/**
	 * The incoming friend requests that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>|null} a Cache of incoming friend request Users (or null if bot account)
	 * @readonly
	 * @example
	 * // log names of the incoming friend requests that the client is aware of
	 * for(var user of client.incomingFriendRequests){
	 *     console.log(user.username);
	 * }
	 */
	get incomingFriendRequests() {
		return this.internal.incoming_friend_requests;
	}

	/**
	 * The outgoing friend requests that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>} a Cache of outgoing friend request Users
	 * @readonly
	 * @example
	 * // log names of the outgoing friend requests that the client is aware of
	 * for(var user of client.outgoingFriendRequests){
	 *     console.log(user.username);
	 * }
	 */
	get outgoingFriendRequests() {
		return this.internal.outgoing_friend_requests;
	}

	/**
	 * A cache of active voice connection of the Client, or null if not applicable. Only available after `ready` event has been emitted.
	 * @type {Cache<VoiceConnection>} a Cache of Voice Connections
	 */
	get voiceConnections() {
		return this.internal.voiceConnections;
	}

	/**
	 * The first voice connection the bot has connected to. Available for backwards compatibility.
	 * @type {VoiceConnection} first voice connection
	 */
	get voiceConnection() {
		return this.internal.voiceConnection;
	}

	/**
	 * Unix timestamp of when the Client first emitted the `ready `event. Only available after `ready` event has been emitted.
	 * @type {Number} timestamp of ready time
	 * @example
	 * // output when the client was ready
	 * console.log("I was first ready at " + client.readyTime);
	 */
	get readyTime() {
		return this.internal.readyTime;
	}

	/**
	 * How long the client has been ready for in milliseconds. Only available after `ready` event has been emitted.
	 * @type {Number} number in milliseconds representing uptime of the client
	 * @example
	 * // log how long the client has been up for
	 * console.log("I have been online for " + client.uptime + " milliseconds");
	 */
	get uptime() {
		return this.internal.uptime;
	}

	/**
	 * A User object that represents the account the client is logged into. Only available after `ready` event has been emitted.
	 * @type {User} user representing logged in account of client.
	 * @example
	 * // log username of logged in account of client
	 * console.log("Logged in as " + client.user.username);
	 */
	get user() {
		return this.internal.user;
	}

	/**
	 * Object containing user-agent information required for API requests. If not modified, it will use discord.js's defaults.
	 * @type {UserAgent}
	 * @example
	 * // log the stringified user-agent:
	 * console.log(client.userAgent.full);
	 */
	get userAgent() {
		return this.internal.userAgent;
	}

	/**
	 * Set the user-agent information provided. Follows the UserAgent typedef format excluding the `full` property.
	 * @type {UserAgent}
	 */
	set userAgent(userAgent) {
		this.internal.userAgent = userAgent;
	}

	/**
	 * Log the client in using a token. If you want to use methods such as `client.setUsername` or `client.setAvatar`, you must also pass the email and password parameters.
	 * @param {string} token A valid token that can be used to authenticate the account.
	 * @param {string} [email] Email of the Discord Account.
	 * @param {string} [password] Password of the Discord Account.
	 * @param {function(err: Error, token: string)} [callback] callback callback to the method
	 * @returns {Promise<string, Error>} Resolves with the token if the login was successful, otherwise it rejects with an error.
	 * @example
	 * // log the client in - callback
	 * client.login("token123", null, null, function(error, token){
	 *    if(!error){
	 *       console.log(token);
	 *    }
	 * });
	 * @example
	 * // log the client in - promise
	 * client.login("token123")
	 *     .then(token => console.log(token))
	 *     .catch(err => console.log(err));
	 */
	loginWithToken(token, email = null, password = null, callback = (/*err, token*/) => {}) {
		if (typeof email === "function") {
			// email is the callback
			callback = email;
			email = null;
			password = null;
		}

		return this.internal.loginWithToken(token, email, password)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Log the client in using an email and password.
	 * @param {string} email Email of the Discord Account.
	 * @param {string} password Password of the Discord Account.
	 * @param {function(err: Error, token: string)} [callback] callback callback to the method
	 * @returns {Promise<string, Error>} Resolves with the token if the login was successful, otherwise it rejects with an error.
	 * @example
	 * // log the client in - callback
	 * client.login("jeff@gmail.com", "password", function(error, token){
	 *    if(!error){
	 *       console.log(token);
	 *    }
	 * });
	 * @example
	 * // log the client in - promise
	 * client.login("jeff@gmail.com", "password")
	 *     .then(token => console.log(token))
	 *     .catch(err => console.log(err));
	 */
	login(email, password, callback = (/*err, token*/) => { }) {
		return this.internal.login(email, password)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Logs the client out gracefully and closes all WebSocket connections. Client still retains its Caches.
	 * @param {function(err: Error)} [callback] callback callback to the method
	 * @returns {Promise<null, Error>} Resolves with null if the logout was successful, otherwise it rejects with an error.
	 * @example
	 * // log the client out - callback
	 * client.logout(function(error){
	 *     if(error){
	 *         console.log("Couldn't log out.");
	 *     }else{
	 *         console.log("Logged out!");
	 *     }
	 * });
	 * @example
	 * // log the client out - promise
	 * client.logout()
	 *     .then(() => console.log("Logged out!"))
	 *     .catch(error => console.log("Couldn't log out."));
	 */
	logout(callback = (/*err, {}*/) => { }) {
		return this.internal.logout()
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Similar to log out but this should be used if you know you aren't going to be creating the Client again later in your program.
	 * @param {function(err: Error)} [callback] callback callback to the method
	 * @returns {Promise<null, Error>} Resolves with null if the destruction was successful, otherwise it rejects with an error.
	 * @example
	 * // destroy the client - callback
	 * client.destroy(function(error){
	 *     if(error){
	 *         console.log("Couldn't destroy client.");
	 *     }else{
	 *         console.log("Client destroyed!");
	 *     }
	 * });
	 * @example
	 * // destroy the client - promise
	 * client.destroy()
	 *     .then(() => console.log("Client destroyed!"))
	 *     .catch(error => console.log("Couldn't destroy client."));
	 */
	destroy(callback = (/*err, {}*/) => { }) {
		return this.internal.logout()
			.then(() => this.internal.disconnected(true))
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Sends a text message to the specified destination.
	 * @param {TextChannelResolvable} destination where the message should be sent
	 * @param {StringResolvable} content message you want to send
	 * @param {MessageOptions} [options] options you want to apply to the message
	 * @param {function(err: Error, msg: Message)} [callback] to the method
	 * @returns {Promise<Message, Error>} Resolves with a Message if successful, otherwise rejects with an Error.
	 * @example
	 * // sending messages
	 * client.sendMessage(channel, "Hi there!");
	 * client.sendMessage(user, "This is a PM message!");
	 * client.sendMessage(server, "This message was sent to the #general channel of the server!");
	 * client.sendMessage(channel, "This message is TTS.", {tts : true});
	 * @example
	 * // callbacks
	 * client.sendMessage(channel, "Hi there!", function(err, msg){
	 *     if(err){
	 *         console.log("Couldn't send message");
	 *     }else{
	 *         console.log("Message sent!");
	 *     }
	 * });
	 * @example
	 * // promises
	 * client.sendMessage(channel, "Hi there!")
	 *    .then(msg => console.log("Message sent!"))
	 *    .catch(err => console.log("Couldn't send message"));
	 */
	sendMessage(destination, content, options = {}, callback = (/*err, msg*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}
		if (typeof content === "object" && content.file) {
			// content has file
			options = content;
			content = "";
		}

		return this.internal.sendMessage(destination, content, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Sends a TTS text message to the specified destination.
	 * @param {TextChannelResolvable} destination where the message should be sent
	 * @param {StringResolvable} content message you want to send
	 * @param {function(err: Error, msg: Message)} [callback] to the method
	 * @returns {Promise<Message, Error>} Resolves with a Message if successful, otherwise rejects with an Error.
	 * @example
	 * // sending messages
	 * client.sendTTSMessage(channel, "This message is TTS.");
	 * @example
	 * // callbacks
	 * client.sendTTSMessage(channel, "Hi there!", function(err, msg){
	 *     if(err){
	 *         console.log("Couldn't send message");
	 *     }else{
	 *         console.log("Message sent!");
	 *     }
	 * });
	 * @example
	 * // promises
	 * client.sendTTSMessage(channel, "Hi there!")
	 *    .then(msg => console.log("Message sent!"))
	 *    .catch(err => console.log("Couldn't send message"));
	 */
	sendTTSMessage(destination, content, callback = (/*err, msg*/) => { }) {
		return this.sendMessage(destination, content, { tts: true })
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Replies to the author of a message in the same channel the message was sent.
	 * @param {MessageResolvable} message the message to reply to
	 * @param {StringResolvable} content message you want to send
	 * @param {MessageOptions} [options] options you want to apply to the message
	 * @param {function(err: Error, msg: Message)} [callback] to the method
	 * @returns {Promise<Message, Error>} Resolves with a Message if successful, otherwise rejects with an Error.
	 * @example
	 * // reply to messages
	 * client.reply(message, "Hello there!");
	 * client.reply(message, "Hello there, this is a TTS reply!", {tts:true});
	 * @example
	 * // callbacks
	 * client.reply(message, "Hi there!", function(err, msg){
	 *     if(err){
	 *         console.log("Couldn't send message");
	 *     }else{
	 *         console.log("Message sent!");
	 *     }
	 * });
	 * @example
	 * // promises
	 * client.reply(message, "Hi there!")
	 *    .then(msg => console.log("Message sent!"))
	 *    .catch(err => console.log("Couldn't send message"));
	 */
	reply(message, content, options = {}, callback = (/*err, msg*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		var msg = this.internal.resolver.resolveMessage(message);
		if (msg) {
			if (!(msg.channel instanceof PMChannel)) {
				content = msg.author + ", " + content;
			}
			return this.internal.sendMessage(msg, content, options)
				.then(dataCallback(callback), errorCallback(callback));
		}
		var err = new Error("Destination not resolvable to a message!");
		callback(err);
		return Promise.reject(err);
	}

	/**
	 * Replies to the author of a message in the same channel the message was sent using TTS.
	 * @param {MessageResolvable} message the message to reply to
	 * @param {StringResolvable} content message you want to send
	 * @param {function(err: Error, msg: Message)} [callback] to the method
	 * @returns {Promise<Message, Error>} Resolves with a Message if successful, otherwise rejects with an Error.
	 * @example
	 * // reply to messages
	 * client.replyTTS(message, "Hello there, this is a TTS reply!");
	 * @example
	 * // callbacks
	 * client.replyTTS(message, "Hi there!", function(err, msg){
	 *     if(err){
	 *         console.log("Couldn't send message");
	 *     }else{
	 *         console.log("Message sent!");
	 *     }
	 * });
	 * @example
	 * // promises
	 * client.replyTTS(message, "Hi there!")
	 *    .then(msg => console.log("Message sent!"))
	 *    .catch(err => console.log("Couldn't send message"));
	 */
	replyTTS(message, content, callback = (/*err, msg*/) => { }) {
		return this.reply(message, content, { tts: true })
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Deletes a message (if the client has permission to)
	 * @param {MessageResolvable} message the message to delete
	 * @param {MessageDeletionOptions} [options] options to apply when deleting the message
	 * @param {function(err: Error)} [callback] callback to the method
	 * @returns {Promise<null, Error>} Resolves with null if the deletion was successful, otherwise rejects with an Error.
	 * @example
	 * // deleting messages
	 * client.deleteMessage(message);
	 * client.deleteMessage(message, {wait:5000}); //deletes after 5 seconds
	 * @example
	 * // deleting messages - callback
	 * client.deleteMessage(message, function(err){
	 *     if(err){
	 *         console.log("couldn't delete");
	 *     }
	 * });
	 * @example
	 * // deleting messages - promise
	 * client.deleteMessage(message)
	 *     .then(() => console.log("deleted!"))
	 *     .catch(err => console.log("couldn't delete"));
	 */
	deleteMessage(message, options = {}, callback = (/*err, {}*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.deleteMessage(message, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Bulk deletes messages (if the client has permission to)
	 * @param {Array<MessageResolvable>} message the message to delete
	 * @param {function(err: Error)} [callback] callback to the method
	 * @returns {Promise<null, Error>} Resolves with null if the deletion was successful, otherwise rejects with an Error.
	 * @example
	 * // deleting messages
	 * client.deleteMessages([message1, message2]);
	 */
	deleteMessages(messages, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteMessages(messages)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Edits a previously sent message (if the client has permission to)
	 * @param {MessageResolvable} message the message to edit
	 * @param {StringResolvable} content the new content of the message
	 * @param {MessageOptions} [options] options to apply to the message
	 * @param {function(err: Error, msg: Message)} [callback] callback to the method
	 * @returns {Promise<Message, Error>} Resolves with the newly edited message if successful, otherwise rejects with an Error.
	 * @example
	 * // editing messages
	 * client.updateMessage(message, "This is an edit!");
	 * @example
	 * // editing messages - callback
	 * client.updateMessage(message, "This is an edit!", function(err, msg){
	 *     if(err){
	 *         console.log("couldn't edit");
	 *     }
	 * });
	 * @example
	 * // editing messages - promise
	 * client.updateMessage(message, "This is an edit!")
	 *     .then(msg => console.log("edited!"))
	 *     .catch(err => console.log("couldn't edit"));
	 */
	updateMessage(message, content, options = {}, callback = (/*err, msg*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.updateMessage(message, content, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Gets the logs of a channel with a specified limit, starting from the most recent message.
	 * @param {TextChannelResolvable} where the channel to get the logs of
	 * @param {Number} [limit=50] Integer, the maximum amount of messages to retrieve
	 * @param {ChannelLogsOptions} [options] options to use when getting the logs
	 * @param {function(err: Error, logs: Array<Message>)} [callback] callback to the method
	 * @returns {Promise<Array<Message>, Error>} Resolves with an array of messages if successful, otherwise rejects with an error.
	 * @example
	 * // log content of last 500 messages in channel - callback
	 * client.getChannelLogs(channel, 500, function(err, logs){
	 *     if(!err){
	 *         for(var message of logs){
	 *             console.log(message.content);
	 *         }
	 *     }
	 * });
	 * @example
	 * // log content of last 500 messages in channel - promise
	 * client.getChannelLogs(channel, 500)
	 *     .then(logs => {
	 *         for(var message of logs){
	 *             console.log(message.content);
	 *         }
	 *     })
	 *     .catch(err => console.log("couldn't fetch logs"));
	 */
	getChannelLogs(where, limit = 50, options = {}, callback = (/*err, logs*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}
		else if (typeof limit === "function") {
			// options is the callback
			callback = limit;
			limit = 50;
		}

		return this.internal.getChannelLogs(where, limit, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Gets a single message of a server
	 * @param {ChannelResolvable} channel to get the message from
	 * @param {function(err: Error, msg: Message} [callback] callback to the method
	 * @returns {Promise<Message, Error>} Resolves with a message if the request was successful, otherwise rejects with an error.
	 * @example
	 * // get message object off a snowflake and log its content - callback
	 * client.getMessage(channel, '192696158886428672', function(err, msg) {
	 *     if(!err) {
	 *         console.log(msg.content);
	 *     } else {
	 *         console.log("couldn't get the message");
	 *     }
	 * }
	 * @example
	 * //get message object off a snowflake and log its content - promise
	 * client.getMessage(channel, '192696158886428672')
	 *     .then(msg => {
	 *         console.log(msg.content);
	 *     })
	 *     .catch(err => console.log("couldn't get the message"));
	 */

	getMessage(channel, messageID, callback = (/*err, msg*/) => { }) {
		return this.internal.getMessage(channel, messageID)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Pins a message to a channel.
	 * @param {MessageResolvable} message to pin.
	 * @returns {Promise<null, Error>} resolves null if successful, otherwise rejects with an error.
	 * @example
	 * // pin message - callback
	 * client.pinMessage(msg, (err) => {
	 *     if(!err) {
	 *         console.log("Successfully pinned message")
	 *     } else {
	 *         console.log("Couldn't pin the message: " + err);
	 *     }
	 * });
	 * @example
	 * // pin message - promise
	 * client.pinMessage(msg)
	 *     .then(() => {
	 *         console.log("Successfully pinned message");
	 *     })
	 *     .catch(err => console.log("Couldn't pin the message: " + err));
	 */

	pinMessage(msg, callback = (/*err*/) => { }) {
		return this.internal.pinMessage(msg)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Unpins a message to a server.
	 * @param {MessageResolvable} message to unpin.
	 * @returns {Promise<null, Error>} resolves null if successful, otherwise rejects with an error.
	 * @example
	 * // unpin message - callback
	 * client.unpinMessage(msg, (err) => {
	 *     if(!err) {
	 *         console.log("Successfully unpinned message")
	 *     } else {
	 *         console.log("Couldn't pin the message: " + err);
	 *     }
	 * });
	 * @example
	 * // unpin message - promise
	 * client.unpinMessage(msg)
	 *     .then(() => {
	 *         console.log("Successfully unpinned message");
	 *     })
	 *     .catch(err => console.log("Couldn't unpin the message: " + err));
	 */

	unpinMessage(msg, callback = (/*err*/) => { }) {
		return this.internal.unpinMessage(msg)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Gets all pinned messages of a channel.
	 * @param {TextChannelResolvable} where to get the pins from.
	 * @returns {Promise<Array<Message>, Error>} Resolves with an array of messages if successful, otherwise rejects with an error.
	 * @example
	 * // log all pinned messages - callback
	 * client.getPinnedMessages(channel, (err, messages) => {
	 *     if(!err) {
	 *         for(var message of messages) {
	 *             console.log(message.content);
	 *         }
	 *     } else {
	 *         console.log("Couldn't fetch pins: " + err);
	 *     }
	 * });
	 * @example
	 * // log all pinned messages - promise
	 * client.getPinnedMessages(channel)
	 *     .then(messages => {
	 *         for(var message of messages) {
	 *             console.log(message.content);
	 *         }
	 *     })
	 *     .catch(err => console.log("Couldn't fetch pins: " + err));
	 */

	getPinnedMessages(channel, callback = (/*err, messages*/) => { }) {
		return this.internal.getPinnedMessages(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Gets the banned users of a server (if the client has permission to)
	 * @param {ServerResolvable} server server to get banned users of
	 * @param {function(err: Error, bans: Array<User>)} [callback] callback to the method
	 * @returns {Promise<Array<User>, Error>} Resolves with an array of users if the request was successful, otherwise rejects with an error.
	 * @example
	 * // loop through banned users - callback
	 * client.getBans(server, function(err, bans){
	 *     if(!err){
	 *         for(var user of bans){
	 *             console.log(user.username + " was banned from " + server.name);
	 *         }
	 *     }
	 * });
	 * @example
	 * // loop through banned users - promise
	 * client.getBans(server)
	 *     .then(bans => {
	 *         for(var user of bans){
	 *             console.log(user.username + " was banned from " + server.name);
	 *         }
	 *     })
	 *     .catch(err => console.log("couldn't get bans"));
	 */
	getBans(server, callback = (/*err, bans*/) => { }) {
		return this.internal.getBans(server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Sends a file (embedded if possible) to the specified channel.
	 * @param {TextChannelResolvable} destination channel to send the file to
	 * @param {FileResolvable} attachment the file to send
	 * @param {string} name name of the file, especially including the extension
	 * @param {function(err: Error, msg: Message)} [callback] callback to the method
	 * @returns {Promise<msg: Message, err: Error>} resolves with the sent file as a message if successful, otherwise rejects with an error
	 * @example
	 * // send a file - callback
	 * client.sendFile(channel, new Buffer("Hello this a text file"), "file.txt", function(err, msg){
	 *     if(err){
	 *         console.log("Couldn't send file!");
	 *     }
	 * });
	 * @example
	 * // send a file - promises
	 * client.sendFile(channel, "C:/path/to/file.txt", "file.txt")
	 *     .then(msg => console.log("sent file!"))
	 *     .catch(err => console.log("couldn't send file!"));
	 */
	sendFile(destination, attachment, name, content, callback = (/*err, m*/) => { }) {
		if (typeof content === "function") {
			// content is the callback
			callback = content;
			content = undefined; // Will get resolved into original filename in internal
		}
		if (typeof name === "function") {
			// name is the callback
			callback = name;
			name = undefined; // Will get resolved into original filename in internal
		}

		return this.internal.sendFile(destination, attachment, name, content)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Client accepts the specified invite to join a server. If the Client is already in the server, the promise/callback resolve immediately.
	 * @param {InviteIDResolvable} invite invite to the server
	 * @param {function(err: Error, server: Server)} [callback] callback to the method.
	 * @returns {Promise<Server, Error>} resolves with the newly joined server if succesful, rejects with an error if not.
	 * @example
	 * // join a server - callback
	 * client.joinServer("https://discord.gg/0BwZcrFhUKZ55bJL", function(err, server){
	 *     if(!err){
	 *         console.log("Joined " + server.name);
	 *     }
	 * });
	 * @example
	 * // join a server - promises
	 * client.joinServer("https://discord.gg/0BwZcrFhUKZ55bJL")
	 *     .then(server => console.log("Joined " + server.name))
	 *     .catch(err => console.log("Couldn't join!"));
	 */
	joinServer(invite, callback = (/*err, srv*/) => { }) {
		return this.internal.joinServer(invite)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Creates a Discord Server and joins it
	 * @param {string} name the name of the server
	 * @param {region} [region=london] the region of the server
	 * @param {function(err: Error, server: Server)} [callback] callback to the method
	 * @returns {Promise<Server, Error>} resolves with the newly created server if successful, rejects with an error if not.
	 * @example
	 * //creating a server - callback
	 * client.createServer("discord.js", "london", function(err, server){
	 *     if(err){
	 *         console.log("could not create server");
	 *     }
	 * });
	 * @example
	 * //creating a server - promises
	 * client.createServer("discord.js", "london")
	 *      .then(server => console.log("Made server!"))
	 *      .catch(error => console.log("Couldn't make server!"));
	 */
	createServer(name, region = "london", callback = (/*err, srv*/) => { }) {
		return this.internal.createServer(name, region)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Leaves a Discord Server
	 * @param {ServerResolvable} server the server to leave
	 * @param {function(err: Error)} [callback] callback to the method
	 * @returns {Promise<null, Error>} resolves null if successful, otherwise rejects with an error.
	 */
	leaveServer(server, callback = (/*err, {}*/) => { }) {
		return this.internal.leaveServer(server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateServer
	updateServer(server, options, region, callback = (/*err, srv*/) => { }) {
		if (typeof region === "function") {
			// region is the callback
			callback = region;
			region = undefined;
		} else if (region && typeof options === "string") {
			options = {
				name: options,
				region: region
			};
		}

		return this.internal.updateServer(server, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	/**
	 * Deletes a Discord Server
	 * @param {ServerResolvable} server the server to leave
	 * @param {function(err: Error)} [callback] callback to the method
	 * @returns {Promise<null, Error>} resolves null if successful, otherwise rejects with an error.
	 */
	deleteServer(server, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteServer(server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def createChannel
	createChannel(server, name, type = "text", callback = (/*err, channel*/) => { }) {
		if (typeof type === "function") {
			// options is the callback
			callback = type;
			type = "text";
		}

		return this.internal.createChannel(server, name, type)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteChannel
	deleteChannel(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteChannel(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def banMember
	banMember(user, server, length = 1, callback = (/*err, {}*/) => { }) {
		if (typeof length === "function") {
			// length is the callback
			callback = length;
			length = 1;
		}

		return this.internal.banMember(user, server, length)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def unbanMember
	unbanMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.unbanMember(user, server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def kickMember
	kickMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.kickMember(user, server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def moveMember
	moveMember(user, channel, callback = (/*err, {}*/) => { }) {
		return this.internal.moveMember(user, channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def muteMember
	muteMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.muteMember(user, server)
		.then(dataCallback(callback), errorCallback(callback));
	}

	// def unmuteMember
	unmuteMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.unmuteMember(user, server)
		.then(dataCallback(callback), errorCallback(callback));
	}

	// def deafenMember
	deafenMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.deafenMember(user, server)
		.then(dataCallback(callback), errorCallback(callback));
	}

	// def undeafenMember
	undeafenMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.undeafenMember(user, server)
		.then(dataCallback(callback), errorCallback(callback));
	}

	// def setNickname
	setNickname(server, nick, user, callback = (/*err, {}*/) => { }) {
		if (typeof user === "function") {
			// user is the callback
			callback = user;
			user = null;
		}
		if(!user) {
			user = this.user;
		}
		return this.internal.setNickname(server, nick, user)
		.then(dataCallback(callback), errorCallback(callback));
	}

	// def setNote
	setNote(user, note, callback = (/*err, {}*/) => { }) {
		return this.internal.setNote(user,note)
		.then(dataCallback(callback), errorCallback(callback));
	}

	// def createRole
	createRole(server, data = null, callback = (/*err, role*/) => { }) {
		if (typeof data === "function") {
			// data is the callback
			callback = data;
			data = null;
		}

		return this.internal.createRole(server, data)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateRole
	updateRole(role, data = null, callback = (/*err, role*/) => { }) {
		if (typeof data === "function") {
			// data is the callback
			callback = data;
			data = null;
		}
		return this.internal.updateRole(role, data)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteRole
	deleteRole(role, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteRole(role)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def addMemberToRole
	addMemberToRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.internal.addMemberToRole(member, role)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def addUserToRole
	addUserToRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.addMemberToRole(member, role, callback);
	}

	// def addUserToRole
	memberHasRole(member, role) {
		return this.internal.memberHasRole(member, role);
	}

	// def addUserToRole
	userHasRole(member, role) {
		return this.memberHasRole(member, role);
	}

	// def removeMemberFromRole
	removeMemberFromRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.internal.removeMemberFromRole(member, role)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def removeUserFromRole
	removeUserFromRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.removeMemberFromRole(member, role, callback);
	}

	// def createInvite
	createInvite(chanServ, options, callback = (/*err, invite*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = undefined;
		}

		return this.internal.createInvite(chanServ, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteInvite
	deleteInvite(invite, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteInvite(invite)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def getInvite
	getInvite(invite, callback = (/*err, inv*/) => { }) {
		return this.internal.getInvite(invite)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def getInvites
	getInvites(channel, callback = (/*err, inv*/) => { }) {
		return this.internal.getInvites(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def overwritePermissions
	overwritePermissions(channel, role, options = {}, callback = (/*err, {}*/) => { }) {
		return this.internal.overwritePermissions(channel, role, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setStatus
	setStatus(idleStatus, game, callback = (/*err, {}*/) => { }) {
		if (typeof game === "function") {
			// game is the callback
			callback = game;
			game = null;
		} else if (typeof idleStatus === "function") {
			// idleStatus is the callback
			callback = idleStatus;
			game = null;
		}

		return this.internal.setStatus(idleStatus, game)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def sendTyping
	sendTyping(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.sendTyping(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelTopic
	setChannelTopic(channel, topic, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelTopic(channel, topic)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelName
	setChannelName(channel, name, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelName(channel, name)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelPosition
	setChannelPosition(channel, position, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelPosition(channel, position)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelUserLimit
	setChannelUserLimit(channel, limit, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelUserLimit(channel, limit)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelBitrate
	setChannelBitrate(channel, kbitrate, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelBitrate(channel, kbitrate)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateChannel
	updateChannel(channel, data, callback = (/*err, {}*/) => { }) {
		return this.internal.updateChannel(channel, data)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def startTyping
	startTyping(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.startTyping(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def stopTyping
	stopTyping(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.stopTyping(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateDetails
	updateDetails(details, callback = (/*err, {}*/) => { }) {
		return this.internal.updateDetails(details)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setUsername
	setUsername(name, callback = (/*err, {}*/) => { }) {
		return this.internal.setUsername(name)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setAvatar
	setAvatar(avatar, callback = (/*err, {}*/) => { }) {
		return this.internal.setAvatar(avatar)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def joinVoiceChannel
	joinVoiceChannel(channel, callback = (/*err, channel*/) => { }) {
		return this.internal.joinVoiceChannel(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def leaveVoiceChannel
	leaveVoiceChannel(chann, callback = (/*err, {}*/) => { }) {
		return this.internal.leaveVoiceChannel(chann)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def addFriend
	addFriend(user, callback = (/*err, {}*/) => {}) {
		return this.internal.addFriend(user)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def removeFriend
	removeFriend(user, callback = (/*err, {}*/) => {}) {
		return this.internal.removeFriend(user)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def getOAuthApplication
	getOAuthApplication(appID, callback = (/*err, bans*/) => { }) {
		if (typeof appID === "function") {
			// appID is the callback
			callback = appID;
			appID = null;
		}
		return this.internal.getOAuthApplication(appID)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def awaitResponse
	awaitResponse(msg, toSend = null, options = null, callback = (/*err, newMsg*/) => { }) {
		var ret;

		if (toSend) {
			if (typeof toSend === "function") {
				// (msg, callback)
				callback = toSend;
				toSend = null;
				options = null;
			} else {
				// (msg, toSend, ...)
				if (options) {
					if (typeof options === "function") {
						//(msg, toSend, callback)
						callback = options;
						options = null;
						ret = this.sendMessage(msg, toSend);
					} else {
						//(msg, toSend, options, callback)
						ret = this.sendMessage(msg, toSend, options);
					}
				} else {
					// (msg, toSend) promise
					ret = this.sendMessage(msg, toSend);
				}
			}
		}

		if (!ret) {
			ret = Promise.resolve();
		}
		// (msg) promise
		return ret.then(() => this.internal.awaitResponse(msg))
			.then(dataCallback(callback), errorCallback(callback));
	}

	setStatusIdle(callback = (/*err, {}*/) => { }) {
		return this.internal.setStatus("idle")
			.then(dataCallback(callback), errorCallback(callback));
	}

	setStatusOnline(callback = (/*err, {}*/) => { }) {
		return this.internal.setStatus("online")
			.then(dataCallback(callback), errorCallback(callback));
	}

	setStatusActive(callback) {
		return this.setStatusOnline(callback);
	}

	setStatusHere(callback) {
		return this.setStatusOnline(callback);
	}

	setStatusAvailable(callback) {
		return this.setStatusOnline(callback);
	}

	setStatusAway(callback) {
		return this.setStatusIdle(callback);
	}

	setPlayingGame(game, callback = (/*err, {}*/) => { }) {
		return this.setStatus(null, game, callback);
	}

	setStreaming(name, url, type, callback = (/*err, {}*/) => { }) {
		return this.setStatus(null, {name: name, url: url, type: type}, callback);
	}

	//def forceFetchUsers
	forceFetchUsers(callback){
		return this.internal.forceFetchUsers().then(callback);
	}
}
