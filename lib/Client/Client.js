"use strict";exports.__esModule = true;var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{"default":obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass,superClass){if(typeof superClass !== "function" && superClass !== null){throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _InternalClient=require("./InternalClient");var _InternalClient2=_interopRequireDefault(_InternalClient);var _events=require("events");var _events2=_interopRequireDefault(_events);var _StructuresPMChannel=require("../Structures/PMChannel");var _StructuresPMChannel2=_interopRequireDefault(_StructuresPMChannel); // This utility function creates an anonymous error handling wrapper function
// for a given callback. It is used to allow error handling inside the callback
// and using other means.
function errorCallback(callback){return function(error){callback(error);throw error;};} // This utility function creates an anonymous handler function to separate the
// error and the data arguments inside a callback and return the data if it is
// eventually done (for promise propagation).
function dataCallback(callback){return function(data){callback(null,data);return data;};} /**
 * Used to interface with the Discord API.
 */var Client=(function(_EventEmitter){_inherits(Client,_EventEmitter); /**
	 * Used to instantiate Discord.Client
	 * @param {ClientOptions} [options] options that should be passed to the Client.
	 * @example
	 * // creates a new Client that will try to reconnect whenever it is disconnected.
	 * var client = new Discord.Client({
	 *		autoReconnect : true
	 * });
	 */function Client(){var options=arguments.length <= 0 || arguments[0] === undefined?{}:arguments[0];_classCallCheck(this,Client);_EventEmitter.call(this); /**
		 * Options that were passed to the client when it was instantiated.
		 * @readonly
		 * @type {ClientOptions}
		 */this.options = options || {};this.options.compress = options.compress === undefined?!process.browser:options.compress;this.options.autoReconnect = options.autoReconnect === undefined?true:options.autoReconnect;this.options.rateLimitAsError = options.rateLimitAsError || false;this.options.largeThreshold = options.largeThreshold || 250;this.options.maxCachedMessages = options.maxCachedMessages || 1000;this.options.guildCreateTimeout = options.guildCreateTimeout || 1000;this.options.shardId = options.shardId || 0;this.options.shardCount = options.shardCount || 0;this.options.disableEveryone = options.disableEveryone || false;this.options.bot = options.bot === undefined || options.bot === true?true:false;if(typeof options.shardCount === "number" && typeof options.shardId === "number" && options.shardCount > 0){this.options.shard = [options.shardId,options.shardCount];} /**
		 * Internal Client that the Client wraps around.
		 * @readonly
		 * @type {InternalClient}
		 */this.internal = new _InternalClient2["default"](this);} /**
	 * The users that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>} a Cache of the Users
	 * @readonly
	 * @example
	 * // log usernames of the users that the client is aware of
	 * for(var user of client.users){
	 *     console.log(user.username);
	 * }
	 */ /**
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
	 */Client.prototype.loginWithToken = function loginWithToken(token){var email=arguments.length <= 1 || arguments[1] === undefined?null:arguments[1];var password=arguments.length <= 2 || arguments[2] === undefined?null:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, token*/{}:arguments[3];if(typeof email === "function"){ // email is the callback
callback = email;email = null;password = null;}return this.internal.loginWithToken(token,email,password).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.login = function login(email,password){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, token*/{}:arguments[2];return this.internal.login(email,password).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.logout = function logout(){var callback=arguments.length <= 0 || arguments[0] === undefined?function() /*err, {}*/{}:arguments[0];return this.internal.logout().then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.destroy = function destroy(){var _this=this;var callback=arguments.length <= 0 || arguments[0] === undefined?function() /*err, {}*/{}:arguments[0];return this.internal.logout().then(function(){return _this.internal.disconnected(true);}).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.sendMessage = function sendMessage(destination,content){var options=arguments.length <= 2 || arguments[2] === undefined?{}:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, msg*/{}:arguments[3];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}if(typeof content === "object" && content.file){ // content has file
options = content;content = "";}return this.internal.sendMessage(destination,content,options).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.sendTTSMessage = function sendTTSMessage(destination,content){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, msg*/{}:arguments[2];return this.sendMessage(destination,content,{tts:true}).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.reply = function reply(message,content){var options=arguments.length <= 2 || arguments[2] === undefined?{}:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, msg*/{}:arguments[3];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}var msg=this.internal.resolver.resolveMessage(message);if(msg){if(!(msg.channel instanceof _StructuresPMChannel2["default"])){content = msg.author + ", " + content;}return this.internal.sendMessage(msg,content,options).then(dataCallback(callback),errorCallback(callback));}var err=new Error("Destination not resolvable to a message!");callback(err);return Promise.reject(err);}; /**
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
	 */Client.prototype.replyTTS = function replyTTS(message,content){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, msg*/{}:arguments[2];return this.reply(message,content,{tts:true}).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.deleteMessage = function deleteMessage(message){var options=arguments.length <= 1 || arguments[1] === undefined?{}:arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}return this.internal.deleteMessage(message,options).then(dataCallback(callback),errorCallback(callback));}; /**
	 * Bulk deletes messages (if the client has permission to)
	 * @param {Array<MessageResolvable>} message the message to delete
	 * @param {function(err: Error)} [callback] callback to the method
	 * @returns {Promise<null, Error>} Resolves with null if the deletion was successful, otherwise rejects with an Error.
	 * @example
	 * // deleting messages
	 * client.deleteMessages([message1, message2]);
	 */Client.prototype.deleteMessages = function deleteMessages(messages){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.deleteMessages(messages).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.updateMessage = function updateMessage(message,content){var options=arguments.length <= 2 || arguments[2] === undefined?{}:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, msg*/{}:arguments[3];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}return this.internal.updateMessage(message,content,options).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.getChannelLogs = function getChannelLogs(where){var limit=arguments.length <= 1 || arguments[1] === undefined?50:arguments[1];var options=arguments.length <= 2 || arguments[2] === undefined?{}:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, logs*/{}:arguments[3];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}else if(typeof limit === "function"){ // options is the callback
callback = limit;limit = 50;}return this.internal.getChannelLogs(where,limit,options).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.getMessage = function getMessage(channel,messageID){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, msg*/{}:arguments[2];return this.internal.getMessage(channel,messageID).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.pinMessage = function pinMessage(msg){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err*/{}:arguments[1];return this.internal.pinMessage(msg).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.unpinMessage = function unpinMessage(msg){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err*/{}:arguments[1];return this.internal.unpinMessage(msg).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.getPinnedMessages = function getPinnedMessages(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, messages*/{}:arguments[1];return this.internal.getPinnedMessages(channel).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.getBans = function getBans(server){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, bans*/{}:arguments[1];return this.internal.getBans(server).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.sendFile = function sendFile(destination,attachment,name,content){var callback=arguments.length <= 4 || arguments[4] === undefined?function() /*err, m*/{}:arguments[4];if(typeof content === "function"){ // content is the callback
callback = content;content = undefined; // Will get resolved into original filename in internal
}if(typeof name === "function"){ // name is the callback
callback = name;name = undefined; // Will get resolved into original filename in internal
}return this.internal.sendFile(destination,attachment,name,content).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.joinServer = function joinServer(invite){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, srv*/{}:arguments[1];return this.internal.joinServer(invite).then(dataCallback(callback),errorCallback(callback));}; /**
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
	 */Client.prototype.createServer = function createServer(name){var region=arguments.length <= 1 || arguments[1] === undefined?"london":arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, srv*/{}:arguments[2];return this.internal.createServer(name,region).then(dataCallback(callback),errorCallback(callback));}; /**
	 * Leaves a Discord Server
	 * @param {ServerResolvable} server the server to leave
	 * @param {function(err: Error)} [callback] callback to the method
	 * @returns {Promise<null, Error>} resolves null if successful, otherwise rejects with an error.
	 */Client.prototype.leaveServer = function leaveServer(server){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.leaveServer(server).then(dataCallback(callback),errorCallback(callback));}; // def updateServer
Client.prototype.updateServer = function updateServer(server,options,region){var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, srv*/{}:arguments[3];if(typeof region === "function"){ // region is the callback
callback = region;region = undefined;}else if(region && typeof options === "string"){options = {name:options,region:region};}return this.internal.updateServer(server,options).then(dataCallback(callback),errorCallback(callback));}; /**
	 * Deletes a Discord Server
	 * @param {ServerResolvable} server the server to leave
	 * @param {function(err: Error)} [callback] callback to the method
	 * @returns {Promise<null, Error>} resolves null if successful, otherwise rejects with an error.
	 */Client.prototype.deleteServer = function deleteServer(server){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.deleteServer(server).then(dataCallback(callback),errorCallback(callback));}; // def createChannel
Client.prototype.createChannel = function createChannel(server,name){var type=arguments.length <= 2 || arguments[2] === undefined?0:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, channel*/{}:arguments[3];if(typeof type === "function"){ // options is the callback
callback = type;type = 0;}return this.internal.createChannel(server,name,type).then(dataCallback(callback),errorCallback(callback));}; // def deleteChannel
Client.prototype.deleteChannel = function deleteChannel(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.deleteChannel(channel).then(dataCallback(callback),errorCallback(callback));}; // def banMember
Client.prototype.banMember = function banMember(user,server){var length=arguments.length <= 2 || arguments[2] === undefined?1:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, {}*/{}:arguments[3];if(typeof length === "function"){ // length is the callback
callback = length;length = 1;}return this.internal.banMember(user,server,length).then(dataCallback(callback),errorCallback(callback));}; // def unbanMember
Client.prototype.unbanMember = function unbanMember(user,server){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.unbanMember(user,server).then(dataCallback(callback),errorCallback(callback));}; // def kickMember
Client.prototype.kickMember = function kickMember(user,server){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.kickMember(user,server).then(dataCallback(callback),errorCallback(callback));}; // def moveMember
Client.prototype.moveMember = function moveMember(user,channel){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.moveMember(user,channel).then(dataCallback(callback),errorCallback(callback));}; // def muteMember
Client.prototype.muteMember = function muteMember(user,server){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.muteMember(user,server).then(dataCallback(callback),errorCallback(callback));}; // def unmuteMember
Client.prototype.unmuteMember = function unmuteMember(user,server){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.unmuteMember(user,server).then(dataCallback(callback),errorCallback(callback));}; // def deafenMember
Client.prototype.deafenMember = function deafenMember(user,server){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.deafenMember(user,server).then(dataCallback(callback),errorCallback(callback));}; // def undeafenMember
Client.prototype.undeafenMember = function undeafenMember(user,server){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.undeafenMember(user,server).then(dataCallback(callback),errorCallback(callback));}; // def setNickname
Client.prototype.setNickname = function setNickname(server,nick,user){var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, {}*/{}:arguments[3];if(typeof user === "function"){ // user is the callback
callback = user;user = null;}if(!user){user = this.user;}return this.internal.setNickname(server,nick,user).then(dataCallback(callback),errorCallback(callback));}; // def setNote
Client.prototype.setNote = function setNote(user,note){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.setNote(user,note).then(dataCallback(callback),errorCallback(callback));}; // def createRole
Client.prototype.createRole = function createRole(server){var data=arguments.length <= 1 || arguments[1] === undefined?null:arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, role*/{}:arguments[2];if(typeof data === "function"){ // data is the callback
callback = data;data = null;}return this.internal.createRole(server,data).then(dataCallback(callback),errorCallback(callback));}; // def updateRole
Client.prototype.updateRole = function updateRole(role){var data=arguments.length <= 1 || arguments[1] === undefined?null:arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, role*/{}:arguments[2];if(typeof data === "function"){ // data is the callback
callback = data;data = null;}return this.internal.updateRole(role,data).then(dataCallback(callback),errorCallback(callback));}; // def deleteRole
Client.prototype.deleteRole = function deleteRole(role){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.deleteRole(role).then(dataCallback(callback),errorCallback(callback));}; // def addMemberToRole
Client.prototype.addMemberToRole = function addMemberToRole(member,role){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.addMemberToRole(member,role).then(dataCallback(callback),errorCallback(callback));}; // def addUserToRole
Client.prototype.addUserToRole = function addUserToRole(member,role){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.addMemberToRole(member,role,callback);}; // def addUserToRole
Client.prototype.memberHasRole = function memberHasRole(member,role){return this.internal.memberHasRole(member,role);}; // def addUserToRole
Client.prototype.userHasRole = function userHasRole(member,role){return this.memberHasRole(member,role);}; // def removeMemberFromRole
Client.prototype.removeMemberFromRole = function removeMemberFromRole(member,role){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.removeMemberFromRole(member,role).then(dataCallback(callback),errorCallback(callback));}; // def removeUserFromRole
Client.prototype.removeUserFromRole = function removeUserFromRole(member,role){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.removeMemberFromRole(member,role,callback);}; // def createInvite
Client.prototype.createInvite = function createInvite(chanServ,options){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, invite*/{}:arguments[2];if(typeof options === "function"){ // options is the callback
callback = options;options = undefined;}return this.internal.createInvite(chanServ,options).then(dataCallback(callback),errorCallback(callback));}; // def deleteInvite
Client.prototype.deleteInvite = function deleteInvite(invite){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.deleteInvite(invite).then(dataCallback(callback),errorCallback(callback));}; // def getInvite
Client.prototype.getInvite = function getInvite(invite){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, inv*/{}:arguments[1];return this.internal.getInvite(invite).then(dataCallback(callback),errorCallback(callback));}; // def getInvites
Client.prototype.getInvites = function getInvites(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, inv*/{}:arguments[1];return this.internal.getInvites(channel).then(dataCallback(callback),errorCallback(callback));}; // def overwritePermissions
Client.prototype.overwritePermissions = function overwritePermissions(channel,role){var options=arguments.length <= 2 || arguments[2] === undefined?{}:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, {}*/{}:arguments[3];return this.internal.overwritePermissions(channel,role,options).then(dataCallback(callback),errorCallback(callback));}; // def setStatus
Client.prototype.setStatus = function setStatus(idleStatus,game){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];if(typeof game === "function"){ // game is the callback
callback = game;game = null;}else if(typeof idleStatus === "function"){ // idleStatus is the callback
callback = idleStatus;game = null;}return this.internal.setStatus(idleStatus,game).then(dataCallback(callback),errorCallback(callback));}; // def sendTyping
Client.prototype.sendTyping = function sendTyping(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.sendTyping(channel).then(dataCallback(callback),errorCallback(callback));}; // def setChannelTopic
Client.prototype.setChannelTopic = function setChannelTopic(channel,topic){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.setChannelTopic(channel,topic).then(dataCallback(callback),errorCallback(callback));}; // def setChannelName
Client.prototype.setChannelName = function setChannelName(channel,name){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.setChannelName(channel,name).then(dataCallback(callback),errorCallback(callback));}; // def setChannelPosition
Client.prototype.setChannelPosition = function setChannelPosition(channel,position){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.setChannelPosition(channel,position).then(dataCallback(callback),errorCallback(callback));}; // def setChannelUserLimit
Client.prototype.setChannelUserLimit = function setChannelUserLimit(channel,limit){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.setChannelUserLimit(channel,limit).then(dataCallback(callback),errorCallback(callback));}; // def setChannelBitrate
Client.prototype.setChannelBitrate = function setChannelBitrate(channel,kbitrate){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.setChannelBitrate(channel,kbitrate).then(dataCallback(callback),errorCallback(callback));}; // def updateChannel
Client.prototype.updateChannel = function updateChannel(channel,data){var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];return this.internal.updateChannel(channel,data).then(dataCallback(callback),errorCallback(callback));}; // def startTyping
Client.prototype.startTyping = function startTyping(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.startTyping(channel).then(dataCallback(callback),errorCallback(callback));}; // def stopTyping
Client.prototype.stopTyping = function stopTyping(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.stopTyping(channel).then(dataCallback(callback),errorCallback(callback));}; // def updateDetails
Client.prototype.updateDetails = function updateDetails(details){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.updateDetails(details).then(dataCallback(callback),errorCallback(callback));}; // def setUsername
Client.prototype.setUsername = function setUsername(name){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.setUsername(name).then(dataCallback(callback),errorCallback(callback));}; // def setAvatar
Client.prototype.setAvatar = function setAvatar(avatar){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.setAvatar(avatar).then(dataCallback(callback),errorCallback(callback));}; // def joinVoiceChannel
Client.prototype.joinVoiceChannel = function joinVoiceChannel(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, channel*/{}:arguments[1];return this.internal.joinVoiceChannel(channel).then(dataCallback(callback),errorCallback(callback));}; // def leaveVoiceChannel
Client.prototype.leaveVoiceChannel = function leaveVoiceChannel(chann){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.leaveVoiceChannel(chann).then(dataCallback(callback),errorCallback(callback));}; // def addFriend
Client.prototype.addFriend = function addFriend(user){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.addFriend(user).then(dataCallback(callback),errorCallback(callback));}; // def removeFriend
Client.prototype.removeFriend = function removeFriend(user){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.removeFriend(user).then(dataCallback(callback),errorCallback(callback));};Client.prototype.getServerWebhooks = function getServerWebhooks(guild){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.getServerWebhooks(guild).then(dataCallback(callback),errorCallback(callback));};Client.prototype.getChannelWebhooks = function getChannelWebhooks(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.getChannelWebhooks(channel).then(dataCallback(callback),errorCallback(callback));};Client.prototype.sendWebhookMessage = function sendWebhookMessage(webhook,content){var options=arguments.length <= 2 || arguments[2] === undefined?{}:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, {}*/{}:arguments[3];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}return this.internal.sendWebhookMessage(webhook,content,options).then(dataCallback(callback),errorCallback(callback));};Client.prototype.editWebhook = function editWebhook(webhook){var options=arguments.length <= 1 || arguments[1] === undefined?{}:arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}return this.internal.editWebhook(webhook,options).then(dataCallback(callback),errorCallback(callback));};Client.prototype.createWebhook = function createWebhook(webhook){var options=arguments.length <= 1 || arguments[1] === undefined?{}:arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function() /*err, {}*/{}:arguments[2];if(typeof options === "function"){ // options is the callback
callback = options;options = {};}return this.internal.createWebhook(webhook,options).then(dataCallback(callback),errorCallback(callback));};Client.prototype.deleteWebhook = function deleteWebhook(webhook){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.internal.createWebhook(webhook).then(dataCallback(callback),errorCallback(callback));}; // def getOAuthApplication
Client.prototype.getOAuthApplication = function getOAuthApplication(appID){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, bans*/{}:arguments[1];if(typeof appID === "function"){ // appID is the callback
callback = appID;appID = null;}return this.internal.getOAuthApplication(appID).then(dataCallback(callback),errorCallback(callback));}; // def awaitResponse
Client.prototype.awaitResponse = function awaitResponse(msg){var toSend=arguments.length <= 1 || arguments[1] === undefined?null:arguments[1];var _this2=this;var options=arguments.length <= 2 || arguments[2] === undefined?null:arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, newMsg*/{}:arguments[3];var ret;if(toSend){if(typeof toSend === "function"){ // (msg, callback)
callback = toSend;toSend = null;options = null;}else { // (msg, toSend, ...)
if(options){if(typeof options === "function"){ //(msg, toSend, callback)
callback = options;options = null;ret = this.sendMessage(msg,toSend);}else { //(msg, toSend, options, callback)
ret = this.sendMessage(msg,toSend,options);}}else { // (msg, toSend) promise
ret = this.sendMessage(msg,toSend);}}}if(!ret){ret = Promise.resolve();} // (msg) promise
return ret.then(function(){return _this2.internal.awaitResponse(msg);}).then(dataCallback(callback),errorCallback(callback));};Client.prototype.setStatusIdle = function setStatusIdle(){var callback=arguments.length <= 0 || arguments[0] === undefined?function() /*err, {}*/{}:arguments[0];return this.internal.setStatus("idle").then(dataCallback(callback),errorCallback(callback));};Client.prototype.setStatusOnline = function setStatusOnline(){var callback=arguments.length <= 0 || arguments[0] === undefined?function() /*err, {}*/{}:arguments[0];return this.internal.setStatus("online").then(dataCallback(callback),errorCallback(callback));};Client.prototype.setStatusActive = function setStatusActive(callback){return this.setStatusOnline(callback);};Client.prototype.setStatusHere = function setStatusHere(callback){return this.setStatusOnline(callback);};Client.prototype.setStatusAvailable = function setStatusAvailable(callback){return this.setStatusOnline(callback);};Client.prototype.setStatusAway = function setStatusAway(callback){return this.setStatusIdle(callback);};Client.prototype.setPlayingGame = function setPlayingGame(game){var callback=arguments.length <= 1 || arguments[1] === undefined?function() /*err, {}*/{}:arguments[1];return this.setStatus(null,game,callback);};Client.prototype.setStreaming = function setStreaming(name,url,type){var callback=arguments.length <= 3 || arguments[3] === undefined?function() /*err, {}*/{}:arguments[3];return this.setStatus(null,{name:name,url:url,type:type},callback);}; //def forceFetchUsers
Client.prototype.forceFetchUsers = function forceFetchUsers(callback){return this.internal.forceFetchUsers().then(callback);};_createClass(Client,[{key:"users",get:function get(){return this.internal.users;} /**
	 * The server channels the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<ServerChannel>} a Cache of the Server Channels
	 * @readonly
	 * @example
	 * // log the names of the channels and the server they belong to
	 * for(var channel of client.channels){
	 *     console.log(`${channel.name} is part of ${channel.server.name}`)
	 * }
	 */},{key:"channels",get:function get(){return this.internal.channels;} /**
	 * The servers the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<Server>} a Cache of the Servers
	 * @readonly
	 * @example
	 * // log the names of the servers
	 * for(var server of client.servers){
	 *     console.log(server.name)
	 * }
	 */},{key:"servers",get:function get(){return this.internal.servers;} /**
	 * The PM/DM chats the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<PMChannel>} a Cache of the PM/DM Channels.
	 * @readonly
	 * @example
	 * // log the names of the users the client is participating in a PM with
	 * for(var pm of client.privateChannels){
	 *     console.log(`Participating in a DM with ${pm.recipient}`)
	 * }
	 */},{key:"privateChannels",get:function get(){return this.internal.private_channels;} /**
	 * The friends that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>|null} a Cache of friend Users (or null if bot account)
	 * @readonly
	 * @example
	 * // log names of the friends that the client is aware of
	 * for(var user of client.friends){
	 *     console.log(user.username);
	 * }
	 */},{key:"friends",get:function get(){return this.internal.friends;} /**
	 * The incoming friend requests that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>|null} a Cache of incoming friend request Users (or null if bot account)
	 * @readonly
	 * @example
	 * // log names of the incoming friend requests that the client is aware of
	 * for(var user of client.incomingFriendRequests){
	 *     console.log(user.username);
	 * }
	 */},{key:"incomingFriendRequests",get:function get(){return this.internal.incoming_friend_requests;} /**
	 * The outgoing friend requests that the Client is aware of. Only available after `ready` event has been emitted.
	 * @type {Cache<User>} a Cache of outgoing friend request Users
	 * @readonly
	 * @example
	 * // log names of the outgoing friend requests that the client is aware of
	 * for(var user of client.outgoingFriendRequests){
	 *     console.log(user.username);
	 * }
	 */},{key:"outgoingFriendRequests",get:function get(){return this.internal.outgoing_friend_requests;} /**
	 * A cache of active voice connection of the Client, or null if not applicable. Only available after `ready` event has been emitted.
	 * @type {Cache<VoiceConnection>} a Cache of Voice Connections
	 */},{key:"voiceConnections",get:function get(){return this.internal.voiceConnections;} /**
	 * The first voice connection the bot has connected to. Available for backwards compatibility.
	 * @type {VoiceConnection} first voice connection
	 */},{key:"voiceConnection",get:function get(){return this.internal.voiceConnection;} /**
	 * Unix timestamp of when the Client first emitted the `ready `event. Only available after `ready` event has been emitted.
	 * @type {Number} timestamp of ready time
	 * @example
	 * // output when the client was ready
	 * console.log("I was first ready at " + client.readyTime);
	 */},{key:"readyTime",get:function get(){return this.internal.readyTime;} /**
	 * How long the client has been ready for in milliseconds. Only available after `ready` event has been emitted.
	 * @type {Number} number in milliseconds representing uptime of the client
	 * @example
	 * // log how long the client has been up for
	 * console.log("I have been online for " + client.uptime + " milliseconds");
	 */},{key:"uptime",get:function get(){return this.internal.uptime;} /**
	 * A User object that represents the account the client is logged into. Only available after `ready` event has been emitted.
	 * @type {User} user representing logged in account of client.
	 * @example
	 * // log username of logged in account of client
	 * console.log("Logged in as " + client.user.username);
	 */},{key:"user",get:function get(){return this.internal.user;} /**
	 * Object containing user-agent information required for API requests. If not modified, it will use discord.js's defaults.
	 * @type {UserAgent}
	 * @example
	 * // log the stringified user-agent:
	 * console.log(client.userAgent.full);
	 */},{key:"userAgent",get:function get(){return this.internal.userAgent;}, /**
	 * Set the user-agent information provided. Follows the UserAgent typedef format excluding the `full` property.
	 * @type {UserAgent}
	 */set:function set(userAgent){this.internal.userAgent = userAgent;}}]);return Client;})(_events2["default"]);exports["default"] = Client;module.exports = exports["default"];
