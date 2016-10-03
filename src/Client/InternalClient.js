"use strict";

import request from "superagent";
import WebSocket from "ws";
import ConnectionState from "./ConnectionState";
import qs from "querystring";

import {Endpoints, PacketType, Permissions} from "../Constants";

import Bucket from "../Util/Bucket";
import Cache from "../Util/Cache";
import Resolver from "./Resolver/Resolver";

import User from "../Structures/User";
import Channel from "../Structures/Channel";
import ServerChannel from "../Structures/ServerChannel";
import TextChannel from "../Structures/TextChannel";
import VoiceChannel from "../Structures/VoiceChannel";
import PMChannel from "../Structures/PMChannel";
import Server from "../Structures/Server";
import Message from "../Structures/Message";
import Role from "../Structures/Role";
import Invite from "../Structures/Invite";
import Webhook from "../Structures/Webhook";
import VoiceConnection from "../Voice/VoiceConnection";
import TokenCacher from "../Util/TokenCacher";

var GATEWAY_VERSION = 6;
var zlib;
var libVersion = require('../../package.json').version;

function waitFor(condition, value = condition, interval = 20) {
	return new Promise(resolve => {
		var int = setInterval(() => {
			var isDone = condition();
			if (isDone) {
				if (condition === value) {
					resolve(isDone);
				} else {
					resolve(value(isDone));
				}
				return clearInterval(int);
			}
		}, interval);
	});
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default class InternalClient {
	constructor(discordClient) {
		this.setup(discordClient);
	}

	apiRequest(method, url, useAuth, data, file) {
		var resolve, reject;
		var promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});
		var buckets = [];
        var match = url.match(/\/channels\/([0-9]+)\/messages(\/[0-9]+)?$/);
        if(match) {
            if(method === "del" && (match[1] = this.channels.get("id", match[1]) || this.private_channels.get("id", match[1]))) {
                buckets = ["dmsg:" + (match[1].server || {}).id];
            } else if(this.user.bot) {
                if(method === "post" || method === "patch") {
                    if(this.private_channels.get("id", match[1])) {
                        buckets = ["bot:msg:dm", "bot:msg:global"];
                    } else if((match[1] = this.channels.get("id", match[1]))) {
                        buckets = ["bot:msg:guild:" + match[1].server.id, "bot:msg:global"];
                    }
                }
            } else {
                buckets = ["msg"];
            }
        } else if(method === "patch") {
            if(url === "/users/@me" && this.user && data.username && data.username !== this.user.username) {
                buckets = ["username"];
            } else if((match = url.match(/\/guilds\/([0-9]+)\/members\/[0-9]+$/))) {
                buckets = ["guild_member:" + match[1]];
            } else if((match = url.match(/\/guilds\/([0-9]+)\/members\/@me\/nick$/))) {
                buckets = ["guild_member_nick:" + match[1]];
            }
        }

        var self = this;

		var actualCall = function() {
			var startTime = Date.now();
			var ret = request[method](url);
			if (useAuth) {
				ret.set("authorization", self.token);
			}
			if (file) {
				ret.attach("file", file.file, file.name);
				if (data) {
					for (var i in data) {
						if (data[i] !== undefined) {
							ret.field(i, data[i]);
						}
					}
				}
			} else if (data) {
				ret.send(data);
			}
			ret.set('User-Agent', self.userAgentInfo.full);
			ret.end((error, data) => {
				if (error) {
					if (data && data.status === 429) {
						self.client.emit("debug", "Encountered 429 at " + url + " | " + self.client.options.shard + " | Buckets" + buckets + " | " + (Date.now() - startTime) + "ms latency");
					}
					reject(error);
				} else {
					resolve(data.body);
				}
			});
		};
        var waitFor = 1;
        var i = 0;
        var done = function() {
            if(++i === waitFor) {
                actualCall();
            }
        };
        for(var bucket of buckets) {
            ++waitFor;
            this.buckets[bucket].queue(done);
        }
        done();
        return promise;
	}

	setup(discordClient) {
		discordClient = discordClient || this.client;
		this.client = discordClient;
		this.state = ConnectionState.IDLE;
		this.websocket = null;
		this.userAgent = {
			url: 'https://github.com/hydrabolt/discord.js',
			version: require('../../package.json').version
		};

		if (this.client.options.compress) {
			zlib = require("zlib");
		}

		// creates 4 caches with discriminators based on ID
		this.users = new Cache();
		this.friends = new Cache();
		this.blocked_users = new Cache();
		this.outgoing_friend_requests = new Cache();
		this.incoming_friend_requests = new Cache();
		this.channels = new Cache();
		this.servers = new Cache();
		this.unavailableServers = new Cache();
		this.private_channels = new Cache();
		this.autoReconnectInterval = 1000;
		this.unsyncedGuilds = 0;
        this.guildSyncQueue = [];
        this.guildSyncQueueLength = 1;

		this.intervals = {
			typing : [],
			kai : null,
			misc : []
		};

		this.voiceConnections = new Cache();
		this.resolver = new Resolver(this);
		this.readyTime = null;
		this.messageAwaits = {};
		this.buckets = {
            "bot:msg:dm": new Bucket(5, 5000),
            "bot:msg:global": new Bucket(50, 10000),
            "msg": new Bucket(10, 10000),
            "dmsg:undefined": new Bucket(5, 1000),
            "username": new Bucket(2, 3600000)
        };

		if (!this.tokenCacher) {
			this.tokenCacher = new TokenCacher(this.client);
			this.tokenCacher.init(0);
		}
	}

	cleanIntervals() {
		for (let interval of this.intervals.typing.concat(this.intervals.misc).concat(this.intervals.kai)) {
			if (interval) {
				clearInterval(interval);
			}
		}
	}

	disconnected(autoReconnect = false) {

		this.cleanIntervals();

		this.voiceConnections.forEach(vc => {
			this.leaveVoiceChannel(vc);
		});

		if (autoReconnect) {
			this.autoReconnectInterval = Math.min(this.autoReconnectInterval * (Math.random() + 1), 60000);
			setTimeout(() => {
				if (!this.email && !this.token) {
					return;
				}

				// Check whether the email is set (if not, only a token has been used for login)
				this.loginWithToken(this.token, this.email, this.password).catch(() => this.disconnected(true));
			}, this.autoReconnectInterval);
		}

		this.client.emit("disconnected");
	}

	get uptime() {
		return (this.readyTime ? Date.now() - this.readyTime : null);
	}

	set userAgent(info) {
		info.full = `DiscordBot (${info.url}, ${info.version})`;
		this.userAgentInfo = info;
	}

	get userAgent() {
		return this.userAgentInfo;
	}

	//def leaveVoiceChannel
	leaveVoiceChannel(chann) {
		if (this.user.bot) {
			var leave = (connection) => {
				return new Promise((resolve, reject) => {
					connection.destroy();
					resolve();
				});
			};

			if (chann instanceof VoiceChannel) {
				return this.resolver.resolveChannel(chann).then(channel => {
					if (!channel) {
						return Promise.reject(new Error("voice channel does not exist"));
					}

					if (channel.type !== 2) {
						return Promise.reject(new Error("channel is not a voice channel!"));
					}

					var connection = this.voiceConnections.get("voiceChannel", channel);
					if (!connection) {
						return Promise.reject(new Error("not connected to that voice channel"));
					}
					return leave(connection);
				});
			} else if (chann instanceof VoiceConnection) {
				return leave(chann);
			} else {
				return Promise.reject(new Error("invalid voice channel/connection to leave"))
			}
		} else {
			// preserve old functionality for non-bots
			if (this.voiceConnections[0]) {
				this.voiceConnections[0].destroy();
			}
			return Promise.resolve();
		}
	}

	//def awaitResponse
	awaitResponse(msg) {
		return new Promise((resolve, reject) => {

			msg = this.resolver.resolveMessage(msg);

			if (!msg) {
				reject(new Error("message undefined"));
				return;
			}

			var awaitID = msg.channel.id + msg.author.id;

			if ( !this.messageAwaits[awaitID] ) {
				this.messageAwaits[awaitID] = [];
			}

			this.messageAwaits[awaitID].push(resolve);
		});
	}

	//def joinVoiceChannel
	joinVoiceChannel(chann) {
		return this.resolver.resolveChannel(chann).then(channel => {
			if (!channel) {
				return Promise.reject(new Error("voice channel does not exist"));
			}

			if (channel.type !== 2) {
				return Promise.reject(new Error("channel is not a voice channel!"));
			}

			var joinSendWS = () => {
				this.sendWS({
					op: 4,
					d: {
						"guild_id": channel.server.id,
						"channel_id": channel.id,
						"self_mute": false,
						"self_deaf": false
					}
				});
			};

			var joinVoice = () => {
				return new Promise((resolve, reject) => {
					var session = this.sessionID, token, server = channel.server, endpoint;

					var timeout = null;

					var check = data => {
						if (data.t === "VOICE_SERVER_UPDATE") {
							if (data.d.guild_id !== server.id) return; // ensure it is the right server
							token = data.d.token;
							endpoint = data.d.endpoint;
							if (!token || !endpoint) return;
							var chan = new VoiceConnection(
								channel, this.client, session, token, server, endpoint
							);
							this.voiceConnections.add(chan);

							chan.on("ready", () => resolve(chan));
							chan.on("error", reject);
							chan.on("close", reject);

							if (timeout) {
								clearTimeout(timeout);
							}
							this.client.removeListener("raw", check);
						}
					};

					timeout = setTimeout(() => {
						this.client.removeListener("raw", check);
						reject(new Error("No voice server details within 10 seconds"));
					}, 10000);

					this.client.on("raw", check);
					joinSendWS();
				});
			};

			var existingServerConn = this.voiceConnections.get("server", channel.server); // same server connection
			if (existingServerConn) {
				joinSendWS(); // Just needs to update by sending via WS, movement in cache will be handled by global handler
				return Promise.resolve(existingServerConn);
			}

			if (!this.user.bot && this.voiceConnections.length > 0) { // nonbot, one voiceconn only, just like last time just disconnect
				return this.leaveVoiceChannel().then(joinVoice);
			}

			return joinVoice();
		});
	}

	// Backwards-compatible utility getter method for the first voice connection
	// Thanks to #q (@qeled) for suggesting this
	get voiceConnection() {
		return this.voiceConnections[0];
	}

	getGuildMembers(serverID, chunkCount) {
		this.forceFetchCount[serverID] = chunkCount;
		if (this.forceFetchLength + 3 + serverID.length > 4000) { // 4096 max, '{"op":8,"d":{"guild_id":[],"query":"","limit":0}}'.length = 49 plus some leeway
			this.requestGuildMembers(this.forceFetchQueue);
			this.forceFetchQueue = [serverID];
			this.forceFetchLength = 1 + serverID.length + 3;
		} else {
			this.forceFetchQueue.push(serverID);
			this.forceFetchLength += serverID.length + 3;
		}
	}

	requestGuildMembers(serverID, query, limit) {
		this.sendWS({op: 8,
			d: {
				guild_id: serverID,
				query: query || "",
				limit: limit || 0
			}
		});
	}

	syncGuild(guildID) {
        if(this.guildSyncQueueLength + 3 + guildID.length > 4050) { // 4096 max, '{"op":12,"d":[]}'.length = 16 plus some leeway
            this.sendWS({op: 12, d: this.guildSyncQueue});
            this.guildSyncQueue = [guildID];
            this.guildSyncQueueLength = 1 + guildID.length + 3;
        } else {
            this.guildSyncQueue.push(guildID);
            this.guildSyncQueueLength += guildID.length + 3;
        }
	}

	checkReady() {
		if (!this.readyTime) {
            if(this.guildSyncQueue.length > 0) {
            	this.sendWS({op: 12, d: this.guildSyncQueue});
                this.guildSyncQueue = [];
                this.guildSyncQueueLength = 1;
                return;
            }
            if(this.unsyncedGuilds > 0) {
                return;
            }
			if (this.forceFetchQueue.length > 0) {
				this.requestGuildMembers(this.forceFetchQueue);
				this.forceFetchQueue = [];
				this.forceFetchLength = 1;
			} else {
				for (var key in this.forceFetchCount) {
					if (this.forceFetchCount.hasOwnProperty(key)) {
						return;
					}
				}
				this.readyTime = Date.now();
				this.client.emit("ready");
			}
		}
	}

	restartServerCreateTimeout() {
		if (this.guildCreateTimeout) {
			clearTimeout(this.guildCreateTimeout);
			this.guildCreateTimeout = null;
		}
		if (!this.readyTime) {
			this.guildCreateTimeout = setTimeout(() => {
				this.checkReady();
			}, this.client.options.guildCreateTimeout);
		}
	}

	// def createServer
	createServer(name, region = "london") {
		name = this.resolver.resolveString(name);

		return this.apiRequest('post', Endpoints.SERVERS, true, { name, region })
		.then(res => {
			// valid server, wait until it is cached
			return waitFor(() => this.servers.get("id", res.id));
		});
	}

	//def joinServer
	joinServer(invite) {
		invite = this.resolver.resolveInviteID(invite);
		if (!invite) {
			return Promise.reject(new Error("Not a valid invite"));
		}

		return this.apiRequest("post", Endpoints.INVITE(invite), true)
		.then(res => {
			// valid server, wait until it is received via ws and cached
			return waitFor(() => this.servers.get("id", res.guild.id));
		});
	}

	//def updateServer
	updateServer(server, options) {
		var server = this.resolver.resolveServer(server);
		if (!server) {
			return Promise.reject(new Error("server did not resolve"));
		}

		var newOptions = {
			name: options.name || server.name,
			region: options.region || server.region
		};

		if (options.icon) {
			newOptions.icon = this.resolver.resolveToBase64(options.icon);
		}
		if (options.splash) {
			newOptions.splash = this.resolver.resolveToBase64(options.splash);
		}
		if (options.owner) {
			var user = this.resolver.resolveUser(options.owner);
			if (!user) {
				return Promise.reject(new Error("owner could not be resolved"));
			}
			options.owner_id = user.id;
		}
		if (options.verificationLevel) {
			options.verification_level = user.verificationLevel;
		}
		if (options.afkChannel) {
			var channel = this.resolver.resolveUser(options.afkChannel);
			if (!channel) {
				return Promise.reject(new Error("afkChannel could not be resolved"));
			}
			options.afk_channel_id = channel.id;
		}
		if (options.afkTimeout) {
			options.afk_timeout = user.afkTimeout;
		}

		return this.apiRequest("patch", Endpoints.SERVER(server.id), true, options)
		.then(res => {
			// wait until the name and region are updated
			return waitFor(() =>
				(this.servers.get("name", res.name) ? ((this.servers.get("name", res.name).region === res.region) ? this.servers.get("id", res.id) : false) : false));
		});
	}

	//def leaveServer
	leaveServer(srv) {
		var server = this.resolver.resolveServer(srv);
		if (!server) {
			return Promise.reject(new Error("server did not resolve"));
		}

		return this.apiRequest("del", Endpoints.ME_SERVER(server.id), true);
	}

	//def deleteServer
	deleteServer(srv) {
		var server = this.resolver.resolveServer(srv);
		if (!server) {
			return Promise.reject(new Error("server did not resolve"));
		}

		return this.apiRequest("del", Endpoints.SERVER(server.id), true);
	}

	// def loginWithToken
	// email and password are optional
	loginWithToken(token, email, password) {
		this.setup();

		this.state = ConnectionState.LOGGED_IN;
		this.token = token;
		this.email = email;
		this.password = password;

		var self = this;
		return this.getGateway()
		.then(url => {
			self.token = self.client.options.bot && !self.token.startsWith("Bot ") ? `Bot ${self.token}` : self.token;
			self.createWS(url);
			return self.token;
		});
	}

	// def login
	login(email, password) {
		var client = this.client;

		if (!this.tokenCacher.done) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					this.login(email, password).then(resolve).catch(reject);
				}, 20);
			});
		} else {
			var tk = this.tokenCacher.getToken(email, password);
			if ( tk ) {
				this.client.emit("debug", "bypassed direct API login, used cached token");
				return this.loginWithToken(tk, email, password);
			}
		}

		if (this.state !== ConnectionState.DISCONNECTED && this.state !== ConnectionState.IDLE) {
			return Promise.reject(new Error("already logging in/logged in/ready!"));
		}

		this.state = ConnectionState.LOGGING_IN;

		return this.apiRequest("post", Endpoints.LOGIN, false, {
			email,
			password
		})
		.then(res => {
			this.client.emit("debug", "direct API login, cached token was unavailable");
			var token = res.token;
			this.tokenCacher.setToken(email, password, token);
			return this.loginWithToken(token, email, password);
		}, error => {
			this.websocket = null;
			throw error;
		})
		.catch(error => {
			this.websocket = null;
			this.state = ConnectionState.DISCONNECTED;
			client.emit("disconnected");
			throw error;
		});
	}

	// def logout
	logout() {
		if (this.state === ConnectionState.DISCONNECTED || this.state === ConnectionState.IDLE) {
			return Promise.reject(new Error("Client is not logged in!"));
		}

		var disconnect = () => {
			if (this.websocket) {
				this.websocket.close(1000);
				this.websocket = null;
			}
			this.token = null;
			this.email = null;
			this.password = null;
			this.state = ConnectionState.DISCONNECTED;
			return Promise.resolve();
		};

		if(!this.user.bot) {
			return this.apiRequest("post", Endpoints.LOGOUT, true)
			.then(disconnect);
		} else {
			return disconnect();
		}
	}

	// def startPM
	startPM(resUser) {
		var user = this.resolver.resolveUser(resUser);
		if (!user) {
			return Promise.reject(new Error("Unable to resolve resUser to a User"));
		}
				// start the PM
		return this.apiRequest("post", Endpoints.ME_CHANNELS, true, {
			recipient_id: user.id
		})
		.then(res => {
			return this.private_channels.add(new PMChannel(res, this.client));
		});
	}

	// def getGateway
	getGateway() {
		if (this.gatewayURL) {
			return Promise.resolve(this.gatewayURL);
		}
		return this.apiRequest("get", Endpoints.GATEWAY, true)
		.then(res => this.gatewayURL = res.url);
	}

	// def sendMessage
	sendMessage(where, _content, options = {}) {
		if (options.file) {
			if (typeof options.file !== "object") {
				options.file = {
					file: options.file
				};
			}
			if (!options.file.name) {
				if (options.file.file instanceof String || typeof options.file.file === "string") {
					options.file.name = require("path").basename(options.file.file);
				} else if (options.file.file.path) {
					// fs.createReadStream()'s have .path that give the path. Not sure about other streams though.
					options.file.name = require("path").basename(options.file.file.path);
				} else {
					options.file.name = "default.png"; // Just have to go with default filenames.
				}
			}
		}

		return this.resolver.resolveChannel(where)
		.then(destination => {
			var content = this.resolver.resolveString(_content);

			if (this.client.options.disableEveryone || options.disableEveryone) {
				content = content.replace(/(@)(everyone|here)/g, '$1\u200b$2');
			}

			if (options.file) {
				return this.resolver.resolveFile(options.file.file)
				.then(file =>
					this.apiRequest("post", Endpoints.CHANNEL_MESSAGES(destination.id), true, {
						content: content,
						tts: options.tts,
						nonce: options.nonce
					}, {
						name: options.file.name,
						file: file
					}).then(res => destination.messages.add(new Message(res, destination, this.client)))
				)
			} else {
				return this.apiRequest("post", Endpoints.CHANNEL_MESSAGES(destination.id), true, {
					content: content,
					tts: options.tts,
					nonce: options.nonce
				})
				.then(res => destination.messages.add(new Message(res, destination, this.client)));
			}
		});

	}

	// def sendFile
	sendFile(where, _file, name, content) {
		if (!name) {
			if (_file instanceof String || typeof _file === "string") {
				name = require("path").basename(_file);
			} else if (_file && _file.path) {
				// fs.createReadStream()'s have .path that give the path. Not sure about other streams though.
				name = require("path").basename(_file.path);
			} else {
				name = "default.png"; // Just have to go with default filenames.
			}
		}

		if (content) {
			content = {
				content: this.resolver.resolveString(content)
			};
			if (this.client.options.disableEveryone) {
				content.content = content.content.replace(/(@)(everyone|here)/g, '$1\u200b$2');
			}
		}

		return this.resolver.resolveChannel(where)
		.then(channel =>
			this.resolver.resolveFile(_file)
			.then(file =>
				this.apiRequest("post", Endpoints.CHANNEL_MESSAGES(channel.id), true, content, {
					name,
					file
				}).then(res => channel.messages.add(new Message(res, channel, this.client)))
			)
		);
	}

	// def deleteMessage
	deleteMessage(_message, options = {}) {

		var message = this.resolver.resolveMessage(_message);
		if (!message) {
			return Promise.reject(new Error("Supplied message did not resolve to a message!"));
		}

		var chain = options.wait ? delay(options.wait) : Promise.resolve();
		return chain.then(() =>
			this.apiRequest("del", Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id), true)
		)
		.then(() => message.channel.messages.remove(message));
	}

	// def deleteMessages
	deleteMessages(_messages) {
		if (!_messages instanceof Array)
			return Promise.reject(new Error("Messages provided must be in an array"));
		if (_messages.length < 1)
			return Promise.reject(new Error("You must provide at least one message to delete"));
		else if (_messages.length === 1)
			return this.deleteMessage(_messages[0]);


		var messages = [];
		var channel;
		for (var _message of _messages) {
			var message = this.resolver.resolveMessage(_message);
			if (!message)
				return Promise.reject(new Error("Something other than a message could not be resolved in the array..."));
			if (!message.server)
				return Promise.reject(new Error("You can only bulk delete messages on guild channels"));

			// ensure same channel
			if (!channel) {
				channel = message.channel;
			} else {
				if (message.channel.id !== channel.id)
					return Promise.reject(new Error("You can only bulk delete messages from the same channel at one time..."));
			}

			messages.push(message);
		}

		return this.apiRequest("post", `${Endpoints.CHANNEL_MESSAGES(channel.id)}/bulk_delete`, true, {
			messages: messages.map(m => m.id)
		})
		.then(() => messages.forEach(m => channel.messages.remove(m)));
	}

	// def updateMessage
	updateMessage(msg, _content, options = {}) {

		var message = this.resolver.resolveMessage(msg);

		if (!message) {
			return Promise.reject(new Error("Supplied message did not resolve to a message!"));
		}

		var content = this.resolver.resolveString(_content);

		return this.apiRequest(
			"patch",
			Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id),
			true,
			{
				content: content,
				tts: options.tts
			}
		)
		.then(res => message.channel.messages.update(
			message,
			new Message(res, message.channel, this.client)
		));
	}

	// def getChannelLogs
	getChannelLogs(_channel, limit = 50, options = {}) {
		return this.resolver.resolveChannel(_channel)
		.then(channel => {
			var qsObject = {limit};
			if (options.before) {
				const res = this.resolver.resolveMessage(options.before);
				if (res) {
					qsObject.before = res.id;
				}
			}
			if (options.after) {
				const res = this.resolver.resolveMessage(options.after);
				if (res) {
					qsObject.after = res.id;
				}
			}
			if (options.around) {
				const res = this.resolver.resolveMessage(options.around);
				if (res) {
					qsObject.around = res.id
				}
			}

			return this.apiRequest(
				"get",
				`${Endpoints.CHANNEL_MESSAGES(channel.id)}?${qs.stringify(qsObject)}`,
				true
			)
			.then(res => res.map(
				msg => channel.messages.add(new Message(msg, channel, this.client))
			));
		});
	}

	// def getMessage
	getMessage(_channel, messageID) {
		return this.resolver.resolveChannel(_channel)
		.then(channel => {
			if(!this.user.bot) {
				return Promise.reject(new Error("Only OAuth bot accounts can use this function"));
			}

			if(!(channel instanceof TextChannel || channel instanceof PMChannel)) {
				return Promise.reject(new Error("Provided channel is not a Text or PMChannel"));
			}

			var msg = channel.messages.get("id", messageID);
			if(msg) {
				return Promise.resolve(msg);
			}

			return this.apiRequest(
				"get",
				`${Endpoints.CHANNEL_MESSAGES(channel.id)}/${messageID}`,
				true
			)
			.then(res => channel.messages.add(
				new Message(res, channel, this.client)
			));
		});
	}

	// def pinMessage
	pinMessage(msg) {
		var message = this.resolver.resolveMessage(msg);

		if(!message) {
			return Promise.reject(new Error("Supplied message did not resolve to a message"));
		}

		return this.apiRequest(
			"put",
			`${Endpoints.CHANNEL_PIN(msg.channel.id, msg.id)}`,
			true
		);
	}

	// def unpinMessage
	unpinMessage(msg) {
		var message = this.resolver.resolveMessage(msg);

		if(!message) {
			return Promise.reject(new Error("Supplied message did not resolve to a message"));
		}

		if(!message.pinned) {
			return Promise.reject(new Error("Supplied message is not pinned"));
		}

		return this.apiRequest(
			"del",
			`${Endpoints.CHANNEL_PIN(msg.channel.id, msg.id)}`,
			true
		);
	}

	// def getPinnedMessages
	getPinnedMessages(_channel) {
		return this.resolver.resolveChannel(_channel)
		.then(channel => {
			return this.apiRequest(
				"get",
				`${Endpoints.CHANNEL_PINS(channel.id)}`,
				true
			)
			.then(res => res.map(
				msg => channel.messages.add(new Message(msg, channel, this.client))
			));
		});
	}

	// def getBans
	getBans(server) {
		server = this.resolver.resolveServer(server);

		return this.apiRequest("get", Endpoints.SERVER_BANS(server.id), true)
			.then(res => res.map(
				ban => this.users.add(new User(ban.user, this.client))
			));
	}

	// def createChannel
	createChannel(server, name, type = 0) {

		server = this.resolver.resolveServer(server);

		return this.apiRequest("post", Endpoints.SERVER_CHANNELS(server.id), true, {
			name,
			type
		})
		.then(res => {
			var channel;
			if (res.type === 0) {
				channel = new TextChannel(res, this.client, server);
			} else {
				channel = new VoiceChannel(res, this.client, server);
			}
			return server.channels.add(this.channels.add(channel));
		});
	}

	// def deleteChannel
	deleteChannel(_channel) {

		return this.resolver.resolveChannel(_channel)
		.then(channel =>
			this.apiRequest("del", Endpoints.CHANNEL(channel.id), true)
			.then(() => {
				if(channel.server) {
					channel.server.channels.remove(channel);
					this.channels.remove(channel);
				} else {
					this.private_channels.remove(channel);
				}
			})
		);
	}

	// def banMember
	banMember(user, server, length = 1) {
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);

		return this.apiRequest(
			"put",
			`${Endpoints.SERVER_BANS(server.id)}/${user.id}?delete-message-days=${length}`,
			true
		);
	}

	// def unbanMember
	unbanMember(user, server) {

		server = this.resolver.resolveServer(server);
		user = this.resolver.resolveUser(user);

		return this.apiRequest("del", `${Endpoints.SERVER_BANS(server.id)}/${user.id}`, true)
	}

	// def kickMember
	kickMember(user, server) {
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);

		return this.apiRequest("del", `${Endpoints.SERVER_MEMBERS(server.id) }/${user.id}`, true);
	}

	// def moveMember
	moveMember(user, channel) {
		user = this.resolver.resolveUser(user);
		return this.resolver.resolveChannel(channel).then(channel => {
			var server = channel.server;

			// Make sure `channel` is a voice channel
			if (channel.type !== 2) {
				throw new Error("Can't moveMember into a non-voice channel");
			} else {
				return this.apiRequest("patch", `${Endpoints.SERVER_MEMBERS(server.id)}/${user.id}`, true, { channel_id: channel.id })
				.then(res => {
					user.voiceChannel = channel;
					return res;
				});
			}
		});
	}

	// def muteMember
	muteMember(user, server) {
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);
		return this.apiRequest("patch", `${Endpoints.SERVER_MEMBERS(server.id)}/${user.id}`, true, { mute: true });
	}

	// def unmuteMember
	unmuteMember(user, server) {
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);
		return this.apiRequest("patch", `${Endpoints.SERVER_MEMBERS(server.id)}/${user.id}`, true, { mute: false });
	}

	// def deafenMember
	deafenMember(user, server) {
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);
		return this.apiRequest("patch", `${Endpoints.SERVER_MEMBERS(server.id)}/${user.id}`, true, { deaf: true });
	}

	// def undeafenMember
	undeafenMember(user, server) {
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);
		return this.apiRequest("patch", `${Endpoints.SERVER_MEMBERS(server.id)}/${user.id}`, true, { deaf: false });
	}

	// def setNickname
	setNickname(server, nick, user) {
		nick = nick || "";
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);
		return this.apiRequest("patch", `${Endpoints.SERVER_MEMBERS(server.id)}/${user.id === this.user.id ? "@me/nick" : user.id}`, true, { nick: nick });
	}

	//def setNote
	setNote(user, note) {
		user = this.resolver.resolveUser(user);
		note = note || "";

		if(!user) {
			return Promise.reject(new Error("Failed to resolve user"));
		}

		return this.apiRequest("put", `${Endpoints.ME_NOTES}/${user.id}`, true, { note: note });
	}

	// def createRole
	createRole(server, data) {
		server = this.resolver.resolveServer(server);

		return this.apiRequest("post", Endpoints.SERVER_ROLES(server.id), true)
		.then(res => {
			var role = server.roles.add(new Role(res, server, this.client));

			if (data) {
				return this.updateRole(role, data);
			}
			return role;
		});
	}
	// def updateRole
	updateRole(role, data) {

		role = this.resolver.resolveRole(role);
		var server = this.resolver.resolveServer(role.server);

		var newData = {
			color: "color" in data ? data.color : role.color,
			hoist: "hoist" in data ? data.hoist : role.hoist,
			name: "name" in data ? data.name : role.name,
			position: "position" in data ? data.position : role.position,
			permissions: "permissions" in data ? data.permissions : role.permissions,
			mentionable: "mentionable" in data ? data.mentionable : role.mentionable
		};

		if (data.permissions) {
			newData.permissions = 0;
			for (var perm of data.permissions) {
				if (perm instanceof String || typeof perm === "string") {
					newData.permissions |= (Permissions[perm] || 0);
				} else {
					newData.permissions |= perm;
				}
			}
		}

		return this.apiRequest("patch", `${Endpoints.SERVER_ROLES(server.id)}/${role.id}`, true, newData)
		.then(res => {
			return server.roles.update(role, new Role(res, server, this.client));
		});
	}

	// def deleteRole
	deleteRole(role) {
		if (role.server.id === role.id) {
			return Promise.reject(new Error("Stop trying to delete the @everyone role. It is futile"));
		} else {
			return this.apiRequest("del", `${Endpoints.SERVER_ROLES(role.server.id)}/${role.id}`, true);
		}
	}

	//def addMemberToRole
	addMemberToRole(member, roles) {
		member = this.resolver.resolveUser(member);

		if (!member) {
			return Promise.reject(new Error("user not found"));
		}

		if (!Array.isArray(roles) || roles.length === 0) {
			roles = this.resolver.resolveRole(roles);
			if (roles) {
				roles = [roles];
			} else {
				return Promise.reject(new Error("invalid array of roles"));
			}
		} else {
			roles = roles.map(r => this.resolver.resolveRole(r));
		}

		if (roles.some(role => !role.server.memberMap[member.id])) {
			return Promise.reject(new Error("Role does not exist on same server as member"));
		}

		var roleIDs = roles[0].server.memberMap[member.id].roles.map(r => (r && r.id) || r);

		for (var i = 0; i < roles.length; i++) {
			if (!~roleIDs.indexOf(roles[i].id)) {
				roleIDs.push(roles[i].id);
			};
		};

		return this.apiRequest(
			"patch",
			`${Endpoints.SERVER_MEMBERS(roles[0].server.id)}/${member.id}`,
			true,
			{
				roles: roleIDs
			}
		);
	}

	memberHasRole(member, role) {
		role = this.resolver.resolveRole(role);
		member = this.resolver.resolveUser(member);

		if (!role) {
			throw new Error("invalid role");
		}
		if (!member) {
			throw new Error("user not found");
		}

		var roledata = role.server.rolesOf(member);
		if (roledata) {
			for (var r of roledata) {
				if (r.id == role.id) {
					return true;
				}
			}
		}
		return false;
	}

	//def removeMemberFromRole
	removeMemberFromRole(member, roles) {
		member = this.resolver.resolveUser(member);

		if (!member) {
			return Promise.reject(new Error("user not found"));
		}

		if (!Array.isArray(roles) || roles.length === 0) {
			roles = this.resolver.resolveRole(roles);
			if (roles) {
				roles = [roles];
			} else {
				return Promise.reject(new Error("invalid array of roles"));
			}
		} else {
			roles = roles.map(r => this.resolver.resolveRole(r));
		}

		var roleIDs = roles[0].server.memberMap[member.id].roles.map(r => (r && r.id) || r);

		for (var role of roles) {
			if (!role.server.memberMap[member.id]) {
				return Promise.reject(new Error("member not in server"));
			}
			for (var item in roleIDs) {
				if (roleIDs[item] === role.id) {
					roleIDs.splice(item, 1);
					break;
				}
			}
		}

		return this.apiRequest(
			"patch",
			`${Endpoints.SERVER_MEMBERS(roles[0].server.id)}/${member.id}`,
			true,
			{
				roles: roleIDs
			}
		);
	}

	// def createInvite
	createInvite(chanServ, options) {
		return this.resolver.resolveChannel(chanServ)
		.then(channel => {
			if (!options) {
				options = {
					validate: null
				};
			} else {
				options.max_age = options.maxAge || 0;
				options.max_uses = options.maxUses || 0;
				options.temporary = options.temporary || false;
				options.xkcdpass = options.xkcd || false;
			}

			return this.apiRequest("post", Endpoints.CHANNEL_INVITES(channel.id), true, options)
			.then(res => new Invite(res, this.channels.get("id", res.channel.id), this.client));
		});
	}

	//def deleteInvite
	deleteInvite(invite) {
		invite = this.resolver.resolveInviteID(invite);
		if (!invite) {
			throw new Error("Not a valid invite");
		}
		return this.apiRequest("del", Endpoints.INVITE(invite), true);
	}

	//def getInvite
	getInvite(invite) {
		invite = this.resolver.resolveInviteID(invite);
		if (!invite) {
			return Promise.reject(new Error("Not a valid invite"));
		}

		return this.apiRequest("get", Endpoints.INVITE(invite), true)
		.then(res => {
			if (!this.channels.has("id", res.channel.id)) {
				return new Invite(res, null, this.client);
			}
			return this.apiRequest("post", Endpoints.CHANNEL_INVITES(res.channel.id), true, {validate: invite})
			.then(res2 => new Invite(res2, this.channels.get("id", res.channel.id), this.client));
		});
	}

	//def getInvites
	getInvites(channel) {
		if (!(channel instanceof Channel)) {
			var server = this.resolver.resolveServer(channel);
			if (server) {
				return this.apiRequest("get", Endpoints.SERVER_INVITES(server.id), true)
				.then(res => {
					return res.map(data => new Invite(data, this.channels.get("id", data.channel.id), this.client));
				});
			}
		}
		return this.resolver.resolveChannel(channel)
		.then(channel => {
			return this.apiRequest("get", Endpoints.CHANNEL_INVITES(channel.id), true)
			.then(res => {
				return res.map(data => new Invite(data, this.channels.get("id", data.channel.id), this.client));
			});
		});
	}

	//def overwritePermissions
	overwritePermissions(channel, role, updated) {
		return this.resolver.resolveChannel(channel)
		.then(channel => {
			if (!channel instanceof ServerChannel) {
				return Promise.reject(new Error("Not a server channel"));
			}

			var data = {
				allow: 0,
				deny: 0
			};

			if (role instanceof String || typeof role === "string") {
				role = this.resolver.resolveUser(role) || this.resolver.resolveRole(role);
			}

			if (role instanceof User) {
				data.id = role.id;
				data.type = "member";
			} else if (role instanceof Role) {
				data.id = role.id;
				data.type = "role";
			} else {
				return Promise.reject(new Error("Role could not be resolved"));
			}

			var previousOverwrite = channel.permissionOverwrites.get("id", data.id);

			if (previousOverwrite) {
				data.allow |= previousOverwrite.allow;
				data.deny |= previousOverwrite.deny;
			}

			for (var perm in updated) {
				if (updated[perm] === true) {
					data.allow |= (Permissions[perm] || 0);
					data.deny &= ~(Permissions[perm] || 0);
				} else if (updated[perm] === false) {
					data.allow &= ~(Permissions[perm] || 0);
					data.deny |= (Permissions[perm] || 0);
				} else {
					data.allow &= ~(Permissions[perm] || 0);
					data.deny &= ~(Permissions[perm] || 0);
				}
			}

			return this.apiRequest(
				"put",
				`${Endpoints.CHANNEL_PERMISSIONS(channel.id)}/${data.id}`,
				true,
				data
			);
		});
	}

	//def setStatus
	setStatus(idleStatus, game) {

		if (idleStatus === "online" || idleStatus === "here" || idleStatus === "available") {
			this.idleStatus = null;
		}
		else if (idleStatus === "idle" || idleStatus === "away") {
			this.idleStatus = Date.now();
		}
		else {
			this.idleStatus = this.idleStatus || null; //undefined
		}

		// convert undefined and empty string to null
		if (typeof game === "string" && !game.length) game = null;

		this.game = game === null ? null : !game ? this.game || null : typeof game === "string" ? {name: game} : game;

		var packet = {
			op: 3,
			d: {
				idle_since: this.idleStatus,
				game: this.game
			}
		};

		this.sendWS(packet);

		this.user.status = this.idleStatus ? "idle" : "online";
		this.user.game = this.game;

		return Promise.resolve();

	}

	//def sendTyping
	sendTyping(channel) {
		return this.resolver.resolveChannel(channel).then(channel =>
			this.apiRequest("post", Endpoints.CHANNEL(channel.id) + "/typing", true)
		);
	}

	//def startTyping
	startTyping(channel) {
		return this.resolver.resolveChannel(channel)
		.then(channel => {

			if (this.intervals.typing[channel.id]) {
				// typing interval already exists, leave it alone
				throw new Error("Already typing in that channel");
			}

			this.intervals.typing[channel.id] = setInterval(
				() => this.sendTyping(channel)
				.catch(error => this.client.emit("error", error)),
				4000
			);

			return this.sendTyping(channel);
		});

	}

	//def stopTyping
	stopTyping(channel) {
		return this.resolver.resolveChannel(channel)
		.then(channel => {

			if (!this.intervals.typing[channel.id]) {
				// typing interval doesn"t exist
				throw new Error("Not typing in that channel");
			}

			clearInterval(this.intervals.typing[channel.id]);
			this.intervals.typing[channel.id] = false;

		});
	}

	//def updateDetails
	updateDetails(data) {
		if (!this.user.bot && !(this.email || data.email)) {
			throw new Error("Must provide email since a token was used to login");
		}

		var options = {
			avatar: this.resolver.resolveToBase64(data.avatar) || this.user.avatar,
			username: data.username || this.user.username
		};

		if (this.email || data.email) {
			options.email = data.email || this.email;
			options.new_password = data.newPassword || null;
			options.password = data.password || this.password;
		}

		return this.apiRequest("patch", Endpoints.ME, true, options);
	}

	//def setAvatar
	setAvatar(avatar) {
		return this.updateDetails({avatar});
	}

	//def setUsername
	setUsername(username) {
		return this.updateDetails({username});
	}

	//def setChannelTopic
	setChannelTopic(channel, topic = "") {
		topic = topic || "";

		return this.updateChannel(channel, {topic: topic});
	}

	//def setChannelName
	setChannelName(channel, name) {
		name = name || "unnamed-channel";

		return this.updateChannel(channel, {name: name});
	}

	//def setChannelPosition
	setChannelPosition(channel, position) {
		position = position || 0;

		return this.updateChannel(channel, {position: position});
	}

	//def setChannelUserLimit
	setChannelUserLimit(channel, limit) {
		limit = limit || 0; // default 0 = no limit

		return this.updateChannel(channel, {userLimit: limit})
	}

	//def setChannelBitrate
	setChannelBitrate(channel, kbitrate) {
		kbitrate = kbitrate || 64; // default 64kbps

		return this.updateChannel(channel, {bitrate: kbitrate});
	}

	//def updateChannel
	updateChannel(channel, data) {
		return this.resolver.resolveChannel(channel).then(channel => {
			if (!channel) {
				return Promise.reject(new Error("Failed to resolve channel"));
			}

			data = {
				name: data.name || channel.name,
				topic: data.topic || channel.topic,
				position: (data.position ? data.position : channel.position),
				user_limit: (data.userLimit ? data.userLimit : channel.userLimit),
				bitrate: (data.bitrate ? data.bitrate : channel.bitrate ? channel.bitrate : undefined)
			};

			if (data.position < 0) {
				return Promise.reject(new Error("Position cannot be less than 0"));
			}

			if (data.user_limit < 0 || data.user_limit > 99) {
				return Promise.reject(new Error("User limit must be between 0-99"));
			}

			if (data.kbitrate < 8 || data.kbitrate > 96) {
				return Promise.reject(new Error("Bitrate must be between 8-96kbps"));
			}

			if (data.bitrate) {
				data.bitrate *= 1000; // convert to bits before sending
			}

			return this.apiRequest("patch", Endpoints.CHANNEL(channel.id), true, data)
			.then(res => {
				channel.name = data.name;
				channel.topic = data.topic;
				channel.position = data.position;
				channel.userLimit = data.user_limit;
				channel.bitrate = Math.ceil(data.bitrate / 1000);
				channel._bitrate = data.bitrate;
			});
		});
	}

	//def addFriend
	addFriend(user) {
		if (this.user.bot) return Promise.reject(new Error("user is a bot, bot's do not have friends support"));

		var id;
		if (user instanceof String || typeof user === "string")
			id = user;
		else if (user instanceof User) {
			user = this.resolver.resolveUser(user);
			id = user.id
		} else {
			if (user.username && user.discriminator) // add by username and discriminator (pass in an object)
				return this.apiRequest("put", Endpoints.FRIENDS, true, user);
			else
				return Promise.reject("invalid user")
		}

		return this.apiRequest("put", `${Endpoints.FRIENDS}/${id}`, true, {});
	}

	//def removeFriend
	removeFriend(user) {
		if (this.user.bot) return Promise.reject(new Error("user is a bot, bot's do not have friends support"));

		user = this.resolver.resolveUser(user);

		return this.apiRequest("delete", `${Endpoints.FRIENDS}/${user.id}`, true);
	}

	getServerWebhooks(server) {
		server = this.resolver.resolveServer(server);

		if (!server) {
			return Promise.reject(new Error("Failed to resolve server"));
		}

		return this.apiRequest("get", Endpoints.SERVER_WEBHOOKS(server.id), true)
			.then(res => res.map(
				webhook => {
					let channel = this.channels.get("id", webhook.channel_id);
					return channel.webhooks.add(new Webhook(
						webhook,
						server,
						channel,
						this.users.get("id", webhook.user.id)
					))
				}
			));
	}

	getChannelWebhooks(channel) {
		return this.resolver.resolveChannel(channel).then(channel => {
			if (!channel) {
				return Promise.reject(new Error("Failed to resolve channel"));
			}

			return this.apiRequest("get", Endpoints.CHANNEL_WEBHOOKS(channel.id), true)
				.then(res => res.map(
					webhook => channel.webhooks.add(new Webhook(
						webhook,
						this.servers.get("id", webhook.guild_id),
						channel,
						this.users.get("id", webhook.user.id)
					))
				));
		})
	}

	editWebhook(webhook, options = {}) {
		return this.resolver.resolveWebhook(webhook).then(webhook => {
			if (!webhook) {
				return Promise.reject(new Error(" Failed to resolve webhook"))
			}

			if (options.hasOwnProperty("avatar")) {
				options.avatar = this.resolver.resolveToBase64(options.avatar);
			}

			return this.apiRequest("patch", Endpoints.WEBHOOK(webhook.id), true, options)
				.then(res => {
					webhook.name = res.name;
					webhook.avatar = res.hasOwnProperty('avatar') ? res.avatar : webhook.avatar;
				});
		})
	}

	createWebhook(channel, options = {}) {
		return this.resolver.resolveChannel(channel)
			.then(destination => {
				if (!channel) {
					return Promise.reject(new Error(" Failed to resolve channel"))
				}

				if (options.hasOwnProperty("avatar")) {
					options.avatar = this.resolver.resolveToBase64(options.avatar);
				}

				return this.apiRequest("post", Endpoints.CHANNEL_WEBHOOKS(destination.id), true, options)
					.then(webhook => channel.webhooks.add(new Webhook(
						webhook,
						this.servers.get("id", webhook.guild_id),
						channel,
						this.users.get("id", webhook.user.id)
					)));
			});
	}

	deleteWebhook(webhook) {
		return this.resolver.resolveWebhook(webhook).then(webhook => {
			if (!webhook) {
				return Promise.reject(new Error(" Failed to resolve webhook"))
			}

			return this.apiRequest("delete", Endpoints.WEBHOOK(webhook.id), true)
				.then(() => {
					webhook.channel.webhooks.remove(webhook);
				});
		})
	}

	sendWebhookMessage(webhook, _content, options = {}) {
		return this.resolver.resolveWebhook(webhook)
			.then(destination => {
				var content = this.resolver.resolveString(_content);

				if (this.client.options.disableEveryone || options.disableEveryone) {
					content = content.replace(/(@)(everyone|here)/g, '$1\u200b$2');
				}

				if (!options.hasOwnProperty("username")) {
					options.username = this.user.username;
				}

				let slack;
				if (options.hasOwnProperty("slack")) {
					slack = options.slack;
					delete options["slack"];
				}

				options.content = _content;

				return this.apiRequest(
					"post",
					`${Endpoints.WEBHOOK_MESSAGE(destination.id, destination.token)}${slack ? "/slack" : ""}?wait=true`,
					true,
					options
				)
					.catch(console.error)
					.then(res => destination.channel.messages.add(new Message(res, destination.channel, this.client)));
			});

	}

	//def getOAuthApplication
	getOAuthApplication(appID) {
		appID = appID || "@me";
		return this.apiRequest("get", Endpoints.OAUTH2_APPLICATION(appID), true);
	}

	//def ack
	ack(msg) {
		msg = this.resolver.resolveMessage(msg);

		if (!msg) {
			Promise.reject(new Error("Message does not exist"));
		}

		return this.apiRequest("post", Endpoints.CHANNEL_MESSAGE(msg.channel.id, msg.id) + "/ack", true);
	}

	sendWS(object) {
		if (this.websocket) {
			this.websocket.send(JSON.stringify(object));
		}
	}

	createWS(url) {
		if (this.websocket) {
			return false;
		}
		if(!url.endsWith("/")) {
			url += "/";
		}
		url += "?encoding=json&v=" + GATEWAY_VERSION;

		this.websocket = new WebSocket(url);

		this.websocket.onopen = () => {
		};

		this.websocket.onclose = (event) => {
			this.websocket = null;
			this.state = ConnectionState.DISCONNECTED;
			if(event && event.code) {
                this.client.emit("warn", "WS close: " + event.code);
                var err;
                if(event.code === 4001) {
                    err = new Error("Gateway received invalid OP code");
                } else if(event.code === 4005) {
                    err = new Error("Gateway received invalid message");
                } else if(event.code === 4003) {
                    err = new Error("Not authenticated");
                } else if(event.code === 4004) {
                    err = new Error("Authentication failed");
                } else if(event.code === 4005) {
                    err = new Error("Already authenticated");
                } if(event.code === 4006 || event.code === 4009) {
                    err = new Error("Invalid session");
                } else if(event.code === 4007) {
                    this.sequence = 0;
                    err = new Error("Invalid sequence number");
                } else if(event.code === 4008) {
                    err = new Error("Gateway connection was ratelimited");
                } else if(event.code === 4010) {
                    err = new Error("Invalid shard key");
                }
                if(err) {
                	this.client.emit("error", err);
                }
            }
			this.disconnected(this.client.options.autoReconnect);
		};

		this.websocket.onerror = e => {
			this.client.emit("error", e);
			this.websocket = null;
			this.state = ConnectionState.DISCONNECTED;
			this.disconnected(this.client.options.autoReconnect);
		};

		this.websocket.onmessage = e => {
			if (e.data instanceof Buffer) {
				if (!zlib) zlib = require("zlib");
				e.data = zlib.inflateSync(e.data).toString();
			}

			var packet;
			try {
				packet = JSON.parse(e.data);
			} catch (e) {
				this.client.emit("error", e);
				return;
			}

			this.client.emit("raw", packet);

			if(packet.s) {
                this.sequence = packet.s;
            }

			switch(packet.op) {
				case 0:
					this.processPacket(packet);
					break;
				case 1:
					this.heartbeat();
					break;
				case 7:
					this.disconnected(true);
					break;
				case 9:
					this.sessionID = null;
					this.sequence = 0;
					this.identify();
					break;
				case 10:
					if(this.sessionID) {
						this.resume();
					} else {
						this.identify();
					}
					this.heartbeat();
					this.intervals.kai = setInterval(() => this.heartbeat(), packet.d.heartbeat_interval);
					break;
				case 11:
					this.heartbeatAcked = true;
					break;
				default:
					this.client.emit("unknown", packet);
					break;
			}
		};
	}

	processPacket(packet) {
		var client = this.client;
		var data = packet.d;
		switch (packet.t) {
			case PacketType.RESUME:
			case PacketType.READY:
				this.autoReconnectInterval = 1000;
				this.state = ConnectionState.READY;

				if(packet.t === PacketType.RESUME) {
					break;
				}

				this.sessionID = data.session_id;
				var startTime = Date.now();

				this.user = this.users.add(new User(data.user, client));

				this.forceFetchCount = {};
				this.forceFetchQueue = [];
				this.forceFetchLength = 1;

				data.guilds.forEach(server => {
					if (!server.unavailable) {
						server = this.servers.add(new Server(server, client));
	                    if(client.options.bot === false) {
	                        this.unsyncedGuilds++;
	                        this.syncGuild(server.id);
	                    }
						if (this.client.options.forceFetchUsers && server.members && server.members.length < server.memberCount) {
							this.getGuildMembers(server.id, Math.ceil(server.memberCount / 1000));
						}
					} else {
						client.emit("debug", "server " + server.id + " was unavailable, could not create (ready)");
						this.unavailableServers.add(server);
					}
				});
				data.private_channels.forEach(pm => {
					this.private_channels.add(new PMChannel(pm, client));
				});
				if (!data.user.bot) { // bots dont have friends
					data.relationships.forEach(friend => {
						if (friend.type === 1) { // is a friend
							this.friends.add(new User(friend.user, client));
						} else if (friend.type === 2) { // incoming friend requests
							this.blocked_users.add(new User(friend.user, client));
						} else if (friend.type === 3) { // incoming friend requests
							this.incoming_friend_requests.add(new User(friend.user, client));
						} else if (friend.type === 4) { // outgoing friend requests
							this.outgoing_friend_requests.add(new User(friend.user, client));
						} else {
							client.emit("warn", "unknown friend type " + friend.type);
						}
					});
				} else {
					this.friends = null;
					this.blocked_users = null;
					this.incoming_friend_requests = null;
					this.outgoing_friend_requests = null;
				}

				// add notes to users
				if(data.notes) {
					for(note in data.notes) {
						var user = this.users.get("id", note);
						if(user) {
							var newUser = user;
							newUser.note = data.notes[note];

							this.users.update(user, newUser);
						} else {
							client.emit("warn", "note in ready packet but user not cached");
						}
					}
				}

				client.emit("debug", `ready packet took ${Date.now() - startTime}ms to process`);
				client.emit("debug", `ready with ${this.servers.length} servers, ${this.unavailableServers.length} unavailable servers, ${this.channels.length} channels and ${this.users.length} users cached.`);

				this.restartServerCreateTimeout();

				break;

			case PacketType.MESSAGE_CREATE:
				// format: https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
				var channel = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);
				if (channel) {
					var msg = channel.messages.add(new Message(data, channel, client));
					channel.lastMessageID = msg.id;

					if (this.messageAwaits[channel.id + msg.author.id]) {
						this.messageAwaits[channel.id + msg.author.id].map( fn => fn(msg) );
						this.messageAwaits[channel.id + msg.author.id] = null;
						client.emit("message", msg, true); //2nd param is isAwaitedMessage
					} else {
						client.emit("message", msg);
					}
				} else {
					client.emit("warn", "message created but channel is not cached");
				}
				break;
			case PacketType.MESSAGE_DELETE:
				var channel = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);
				if (channel) {
					// potentially blank
					var msg = channel.messages.get("id", data.id);
					client.emit("messageDeleted", msg, channel);
					if (msg) {
						channel.messages.remove(msg);
					} else {
						client.emit("debug", "message was deleted but message is not cached");
					}
				} else {
					client.emit("warn", "message was deleted but channel is not cached");
				}
				break;
			case PacketType.MESSAGE_DELETE_BULK:
				var channel = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);
				if (channel) {
					data.ids.forEach((id) => {
						// potentially blank
						var msg = channel.messages.get("id", id);
						client.emit("messageDeleted", msg, channel);
						if (msg) {
							channel.messages.remove(msg);
						} else {
							client.emit("debug", "message was deleted but message is not cached");
						}
					});
				} else {
					client.emit("warn", "message was deleted but channel is not cached");
				}
				break;
			case PacketType.MESSAGE_UPDATE:
				// format https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
				var channel = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);
				if (channel) {
					// potentially blank
					var msg = channel.messages.get("id", data.id);

					if (msg) {
						// old message exists
						data.nonce = data.nonce !== undefined ? data.nonce : msg.nonce;
						data.attachments = data.attachments !== undefined ? data.attachments : msg.attachments;
						data.tts = data.tts !== undefined ? data.tts : msg.tts;
						data.embeds = data.embeds !== undefined ? data.embeds : msg.embeds;
						data.timestamp = data.timestamp !== undefined ? data.timestamp : msg.timestamp;
						data.mention_everyone = data.mention_everyone !== undefined ? data.mention_everyone : msg.everyoneMentioned;
						data.content = data.content !== undefined ? data.content : msg.content;
						data.mentions = data.mentions !== undefined ? data.mentions : msg.mentions;
						data.author = data.author !== undefined ? data.author : msg.author;
						msg = new Message(msg, channel, client);
					} else if (!data.author || !data.content) {
						break;
					}
					var nmsg = new Message(data, channel, client);
					client.emit("messageUpdated", msg, nmsg);
					if (msg) {
						channel.messages.update(msg, nmsg);
					}
				} else {
					client.emit("warn", "message was updated but channel is not cached");
				}
				break;
			case PacketType.SERVER_CREATE:
				var server = this.servers.get("id", data.id);
				if (!server) {
					if (!data.unavailable) {
						server = this.servers.add(new Server(data, client));
	                    if(client.options.bot === false) {
	                        this.unsyncedGuilds++;
	                        this.syncGuild(server.id);
	                    }
						if (client.readyTime) {
							client.emit("serverCreated", server);
						}
						if (this.client.options.forceFetchUsers && server.large && server.members.length < server.memberCount) {
							this.getGuildMembers(server.id, Math.ceil(server.memberCount / 1000));
						}
						var unavailable = this.unavailableServers.get("id", server.id);
						if (unavailable) {
							this.unavailableServers.remove(unavailable);
						}
						this.restartServerCreateTimeout();
					} else {
						client.emit("debug", "server was unavailable, could not create");
					}
				}
				break;
			case PacketType.SERVER_DELETE:
				var server = this.servers.get("id", data.id);
				if (server) {
					if (!data.unavailable) {
						client.emit("serverDeleted", server);

						for (var channel of server.channels) {
							this.channels.remove(channel);
						}

						this.servers.remove(server);

						for (var user of server.members) {
							var found = false;
							for (var s of this.servers) {
								if (s.members.get("id", user.id)) {
									found = true;
									break;
								}
							}
							if (!found) {
								this.users.remove(user);
							}
						}
					} else {
						client.emit("debug", "server was unavailable, could not update");
					}
                	this.buckets["bot:msg:guild:" + packet.d.id] =
	                    this.buckets["dmsg:" + packet.d.id] =
	                    this.buckets["bdmsg:" + packet.d.id] =
	                    this.buckets["guild_member:" + packet.d.id] =
	                    this.buckets["guild_member_nick:" + packet.d.id] = undefined;
				} else {
					client.emit("warn", "server was deleted but it was not in the cache");
				}
				break;
			case PacketType.SERVER_UPDATE:
				var server = this.servers.get("id", data.id);
				if (server) {
					// server exists
					data.members = data.members || [];
					data.channels = data.channels || [];
					var newserver = new Server(data, client);
					newserver.members = server.members;
					newserver.memberMap = server.memberMap;
					newserver.channels = server.channels;
					if (newserver.equalsStrict(server)) {
						// already the same don't do anything
						client.emit("debug", "received server update but server already updated");
					} else {
						client.emit("serverUpdated", new Server(server, client), newserver);
						this.servers.update(server, newserver);
					}
				} else if (!server) {
					client.emit("warn", "server was updated but it was not in the cache");
				}
				break;
			case PacketType.CHANNEL_CREATE:

				var channel = this.channels.get("id", data.id);

				if (!channel) {

					var server = this.servers.get("id", data.guild_id);
					if (server) {
						var chan = null;
						if (data.type === 0) {
							chan = this.channels.add(new TextChannel(data, client, server));
						} else {
							chan = this.channels.add(new VoiceChannel(data, client, server));
						}
						client.emit("channelCreated", server.channels.add(chan));
					} else if (data.is_private) {
						client.emit("channelCreated", this.private_channels.add(new PMChannel(data, client)));
					} else {
						client.emit("warn", "channel created but server does not exist");
					}

				} else {
					client.emit("warn", "channel created but already in cache");
				}

				break;
			case PacketType.CHANNEL_DELETE:
				var channel = this.channels.get("id", data.id) || this.private_channels.get("id", data.id);
				if (channel) {

					if (channel.server) { // accounts for PMs
						channel.server.channels.remove(channel);
						this.channels.remove(channel);
					} else {
						this.private_channels.remove(channel);
					}

					client.emit("channelDeleted", channel);

				} else {
					client.emit("warn", "channel deleted but already out of cache?");
				}
				break;
			case PacketType.CHANNEL_UPDATE:
				var channel = this.channels.get("id", data.id) || this.private_channels.get("id", data.id);
				if (channel) {

					if (channel instanceof PMChannel) {
						//PM CHANNEL
						client.emit("channelUpdated", new PMChannel(channel, client),
							this.private_channels.update(channel, new PMChannel(data, client)));
					} else {
						if (channel.server) {
							if (channel.type === 0) {
								//TEXT CHANNEL
								var chan = new TextChannel(data, client, channel.server);
								chan.messages = channel.messages;
								client.emit("channelUpdated", channel, chan);
								channel.server.channels.update(channel, chan);
								this.channels.update(channel, chan);
							} else {
								//VOICE CHANNEL
								data.members = channel.members;
								var chan = new VoiceChannel(data, client, channel.server);
								client.emit("channelUpdated", channel, chan);
								channel.server.channels.update(channel, chan);
								this.channels.update(channel, chan);
							}
						} else {
							client.emit("warn", "channel updated but server non-existant");
						}
					}

				} else {
					client.emit("warn", "channel updated but not in cache");
				}
				break;
			case PacketType.SERVER_ROLE_CREATE:
				var server = this.servers.get("id", data.guild_id);
				if (server) {
					client.emit("serverRoleCreated", server.roles.add(new Role(data.role, server, client)), server);
				} else {
					client.emit("warn", "server role made but server not in cache");
				}
				break;
			case PacketType.SERVER_ROLE_DELETE:
				var server = this.servers.get("id", data.guild_id);
				if (server) {
					var role = server.roles.get("id", data.role_id);
					if (role) {
						server.roles.remove(role);
						client.emit("serverRoleDeleted", role);
					} else {
						client.emit("warn", "server role deleted but role not in cache");
					}
				} else {
					client.emit("warn", "server role deleted but server not in cache");
				}
				break;
			case PacketType.SERVER_ROLE_UPDATE:
				var server = this.servers.get("id", data.guild_id);
				if (server) {
					var role = server.roles.get("id", data.role.id);
					if (role) {
						var newRole = new Role(data.role, server, client);
						client.emit("serverRoleUpdated", new Role(role, server, client), newRole);
						server.roles.update(role, newRole);
					} else {
						client.emit("warn", "server role updated but role not in cache");
					}
				} else {
					client.emit("warn", "server role updated but server not in cache");
				}
				break;
			case PacketType.SERVER_MEMBER_ADD:
				var server = this.servers.get("id", data.guild_id);
				if (server) {

					server.memberMap[data.user.id] = {
						roles: data.roles,
						mute: false,
						selfMute: false,
						deaf: false,
						selfDeaf: false,
						joinedAt: Date.parse(data.joined_at),
						nick: data.nick || null
					};

					server.memberCount++;

					client.emit(
						"serverNewMember",
						server,
						server.members.add(this.users.add(new User(data.user, client)))
					);

				} else {
					client.emit("warn", "server member added but server doesn't exist in cache");
				}
				break;
			case PacketType.SERVER_MEMBER_REMOVE:
				var server = this.servers.get("id", data.guild_id);
				if (server) {
					var user = this.users.get("id", data.user.id);
					if (user) {
						client.emit("serverMemberRemoved", server, user);
						server.memberMap[data.user.id] = null;
						server.members.remove(user);
						server.memberCount--;
					} else {
						client.emit("warn", "server member removed but user doesn't exist in cache");
					}
				} else {
					client.emit("warn", "server member removed but server doesn't exist in cache");
				}
				break;
			case PacketType.SERVER_MEMBER_UPDATE:
				var server = this.servers.get("id", data.guild_id);
				if (server) {
					var user = this.users.add(new User(data.user, client));
					if (user) {
						var oldMember = null;
						if (server.memberMap[data.user.id]) {
							oldMember = {
								roles: server.memberMap[data.user.id].roles,
								mute: server.memberMap[data.user.id].mute,
								selfMute: server.memberMap[data.user.id].selfMute,
								deaf: server.memberMap[data.user.id].deaf,
								selfDeaf: server.memberMap[data.user.id].selfDeaf,
								nick: server.memberMap[data.user.id].nick
							};
						} else {
							server.memberMap[data.user.id] = {};
						}
						server.memberMap[data.user.id].roles = data.roles ? data.roles : server.memberMap[data.user.id].roles;
						server.memberMap[data.user.id].mute = data.mute || server.memberMap[data.user.id].mute;
						server.memberMap[data.user.id].selfMute = data.self_mute === undefined ? server.memberMap[data.user.id].selfMute : data.self_mute;
						server.memberMap[data.user.id].deaf = data.deaf || server.memberMap[data.user.id].deaf;
						server.memberMap[data.user.id].selfDeaf = data.self_deaf === undefined ? server.memberMap[data.user.id].selfDeaf : data.self_deaf;
						server.memberMap[data.user.id].nick = data.nick === undefined ? server.memberMap[data.user.id].nick : data.nick || null;
						client.emit("serverMemberUpdated", server, user, oldMember);
					} else {
						client.emit("warn", "server member removed but user doesn't exist in cache");
					}
				} else {
					client.emit("warn", "server member updated but server doesn't exist in cache");
				}
				break;
			case PacketType.PRESENCE_UPDATE:

				var user = this.users.add(new User(data.user, client));
				var server = this.servers.get("id", data.guild_id);

				if (user && server) {

					server.members.add(user);

					data.user.username = data.user.username || user.username;
					data.user.id = data.user.id || user.id;
					data.user.avatar = data.user.avatar !== undefined ? data.user.avatar : user.avatar;
					data.user.discriminator = data.user.discriminator || user.discriminator;
					data.user.status = data.status || user.status;
					data.user.game = data.game !== undefined ? data.game : user.game;
					data.user.bot = data.user.bot !== undefined ? data.user.bot : user.bot;

					var presenceUser = new User(data.user, client);

					if (!presenceUser.equalsStrict(user)) {
						client.emit("presence", user, presenceUser);
						this.users.update(user, presenceUser);
					}

				} else {
					client.emit("warn", "presence update but user/server not in cache");
				}

				break;
			case PacketType.USER_UPDATE:

				var user = this.users.get("id", data.id);

				if (user) {

					data.username = data.username || user.username;
					data.id = data.id || user.id;
					data.avatar = data.avatar || user.avatar;
					data.discriminator = data.discriminator || user.discriminator;
					this.email = data.email || this.email;

					var presenceUser = new User(data, client);

					client.emit("presence", user, presenceUser);
					this.users.update(user, presenceUser);

				} else {
					client.emit("warn", "user update but user not in cache (this should never happen)");
				}

				break;
			case PacketType.TYPING:

				var user = this.users.get("id", data.user_id);
				var channel = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);

				if (user && channel) {
					if (user.typing.since) {
						user.typing.since = Date.now();
						user.typing.channel = channel;
					} else {
						user.typing.since = Date.now();
						user.typing.channel = channel;
						client.emit("userTypingStarted", user, channel);
					}
					setTimeout(() => {
						if (Date.now() - user.typing.since > 5500) {
							// they haven't typed since
							user.typing.since = null;
							user.typing.channel = null;
							client.emit("userTypingStopped", user, channel);
						}
					}, 6000);

				} else {
					client.emit("warn", "user typing but user or channel not existant in cache");
				}
				break;
			case PacketType.SERVER_BAN_ADD:
				var user = this.users.get("id", data.user.id);
				var server = this.servers.get("id", data.guild_id);

				if (user && server) {
					client.emit("userBanned", user, server);
				} else {
					client.emit("warn", "user banned but user/server not in cache.");
				}
				break;
			case PacketType.SERVER_BAN_REMOVE:
				var user = this.users.get("id", data.user.id);
				var server = this.servers.get("id", data.guild_id);

				if (user && server) {
					client.emit("userUnbanned", user, server);
				} else {
					client.emit("warn", "user unbanned but user/server not in cache.");
				}
				break;
			case PacketType.USER_NOTE_UPDATE:
				if(this.user.bot) {
					return;
				}
				var user = this.users.get("id", data.id);
				var oldNote = user.note;
				var note = data.note || null;

				// user in cache
				if(user) {
					var updatedUser = user;
					updatedUser.note = note;

					client.emit("noteUpdated", user, oldNote);

					this.users.update(user, updatedUser);

				} else {
					client.emit("warn", "note updated but user not in cache");
				}
				break;
			case PacketType.VOICE_STATE_UPDATE:
				var user = this.users.get("id", data.user_id);
				var server = this.servers.get("id", data.guild_id);
				var connection = this.voiceConnections.get("server", server);

				if (user && server) {

					if (data.channel_id) {
						// in voice channel
						var channel = this.channels.get("id", data.channel_id);
						if (channel && channel.type === 2) {
							server.eventVoiceStateUpdate(channel, user, data);
						} else {
							client.emit("warn", "voice state channel not in cache");
						}
					} else {
						// not in voice channel
						client.emit("voiceLeave", server.eventVoiceLeave(user), user);
					}

				} else {
					client.emit("warn", "voice state update but user or server not in cache");
				}

				if (user && user.id === this.user.id) { // only for detecting self user movements for connections.
					var connection = this.voiceConnections.get("server", server);
					// existing connection, perhaps channel moved
					if (connection && connection.voiceChannel && connection.voiceChannel.id !== data.channel_id) {
						// moved, update info
						connection.voiceChannel = this.channels.get("id", data.channel_id);
						client.emit("voiceMoved", connection.voiceChannel); // Moved to a new channel
					}
				}

				break;
			case PacketType.SERVER_MEMBERS_CHUNK:

				var server = this.servers.get("id", data.guild_id);

				if (server) {

					var testtime = Date.now();

					for (var user of data.members) {
						server.memberMap[user.user.id] = {
							roles: user.roles,
							mute: user.mute,
							selfMute: false,
							deaf: user.deaf,
							selfDeaf: false,
							joinedAt: Date.parse(user.joined_at),
							nick: user.nick || null
						};
						server.members.add(this.users.add(new User(user.user, client)));
					}

					if (this.forceFetchCount.hasOwnProperty(server.id)) {
						if (this.forceFetchCount[server.id] <= 1) {
							delete this.forceFetchCount[server.id];
							this.restartServerCreateTimeout();
						} else {
							this.forceFetchCount[server.id]--;
						}
					}

					client.emit("debug", (Date.now() - testtime) + "ms for " + data.members.length + " user chunk for server with id " + server.id);

				} else {
					client.emit("warn", "chunk update received but server not in cache");
				}

				break;
			case PacketType.FRIEND_ADD:
				if (this.user.bot) {
					return;
				}
				if (data.type === 1) { // accepted/got accepted a friend request
					var inUser = this.incoming_friend_requests.get("id", data.id);
					if (inUser) {
						// client accepted another user
						this.incoming_friend_requests.remove(this.friends.add(new User(data.user, client)));
						return;
					}

					var outUser = this.outgoing_friend_requests.get("id", data.id);
					if (outUser) {
						// another user accepted the client
						this.outgoing_friend_requests.remove(this.friends.add(new User(data.user, client)));
						client.emit("friendRequestAccepted", outUser);
						return;
					}
				} else if (data.type === 2) {
					// client received block
					this.blocked_users.add(new User(data.user, client));
				} else if (data.type === 3) {
					// client received friend request
					client.emit("friendRequestReceived", this.incoming_friend_requests.add(new User(data.user, client)));
				} else if (data.type === 4) {
					// client sent friend request
					this.outgoing_friend_requests.add(new User(data.user, client));
				}
				break;
			case PacketType.FRIEND_REMOVE:
				if (this.user.bot) {
					return;
				}
				var user = this.friends.get("id", data.id);
				if (user) {
					this.friends.remove(user);
					client.emit("friendRemoved", user);
					return;
				}

				user = this.blocked_users.get("id", data.id);
				if (user) { // they rejected friend request
					this.blocked_users.remove(user);
					return;
				}

				user = this.incoming_friend_requests.get("id", data.id);
				if (user) { // they rejected outgoing friend request OR client user manually deleted incoming thru web client/other clients
					var rejectedUser = this.outgoing_friend_requests.get("id", user.id);
					if (rejectedUser) {
						// other person rejected outgoing
						client.emit("friendRequestRejected", this.outgoing_friend_requests.remove(rejectedUser));
						return;
					}

					// incoming deleted manually
					this.incoming_friend_requests.remove(user);
					return;
				}

				user = this.outgoing_friend_requests.get("id", data.id);
				if (user) { // client cancelled incoming friend request OR client user manually deleted outgoing thru web client/other clients
					var incomingCancel = this.incoming_friend_requests.get("id", user.id);
					if (incomingCancel) {
						// client cancelled incoming
						this.incoming_friend_requests.remove(user);
						return;
					}

					// outgoing deleted manually
					this.outgoing_friend_requests.remove(user);
					return;
				}
				break;
			case PacketType.SERVER_SYNC:// (╯°□°）╯︵ ┻━┻ thx Discord devs
                var guild = this.servers.get(data.id);
				data.members.forEach((dataUser) => {
					guild.memberMap[dataUser.user.id] = {
						roles: dataUser.roles,
						mute: dataUser.mute,
						selfMute: dataUser.self_mute,
						deaf: dataUser.deaf,
						selfDeaf: dataUser.self_deaf,
						joinedAt: Date.parse(dataUser.joined_at),
						nick: dataUser.nick || null
					};
					guild.members.add(client.internal.users.add(new User(dataUser.user, client)));
				});
				for (var presence of data.presences) {
					var user = client.internal.users.get("id", presence.user.id);
					if(user) {
						user.status = presence.status;
						user.game = presence.game;
					}
				}
                if(guild.pendingVoiceStates && guild.pendingVoiceStates.length > 0) {
					for (var voiceState of guild.pendingVoiceStates) {
						let user = guild.members.get("id", voiceState.user_id);
						if (user) {
							guild.memberMap[user.id] = guild.memberMap[user.id] || {};
							guild.memberMap[user.id].mute = voiceState.mute || guild.memberMap[user.id].mute;
							guild.memberMap[user.id].selfMute = voiceState.self_mute === undefined ? guild.memberMap[user.id].selfMute : voiceState.self_mute;
							guild.memberMap[user.id].deaf = voiceState.deaf || guild.memberMap[user.id].deaf;
							guild.memberMap[user.id].selfDeaf = voiceState.self_deaf === undefined ? guild.memberMap[user.id].selfDeaf : voiceState.self_deaf;
							let channel = guild.channels.get("id", voiceState.channel_id);
							if (channel) {
								guild.eventVoiceJoin(user, channel);
							} else {
								guild.client.emit("warn", "channel doesn't exist even though GUILD_SYNC expects them to");
							}
						} else {
							guild.client.emit("warn", "user doesn't exist even though GUILD_SYNC expects them to");
						}
					}
                }
                guild.pendingVoiceStates = null;
                this.unsyncedGuilds--;
                this.restartServerCreateTimeout();
                break;
			default:
				client.emit("unknown", packet);
				break;
		}
	}

	resume() {
		var data = {
			op: 6,
			d: {
	            token: this.token,
	            session_id: this.sessionID,
	            seq: this.sequence
			}
		};

		this.sendWS(data);
	}

	identify() {
		var data = {
			op: 2,
			d: {
				token: this.token,
				v: GATEWAY_VERSION,
				compress: this.client.options.compress,
				large_threshold : this.client.options.largeThreshold,
				properties: {
					"$os": process.platform,
					"$browser": "discord.js",
					"$device": "discord.js",
					"$referrer": "",
					"$referring_domain": ""
				}
			}
		};

		if (this.client.options.shard) {
			data.d.shard = this.client.options.shard;
		}

		this.sendWS(data);
	}

	heartbeat() {
		this.sendWS({ op: 1, d: Date.now() });
	}
}
