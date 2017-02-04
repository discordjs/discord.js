"use strict";
/* global Buffer */

/**
 * Resolves supplied data type to a Channel. If a String, it should be a Channel ID.
 * @typedef {(Channel|Server|Message|User|String)} ChannelResolvable
*/
/**
 * Resolves supplied data type to a TextChannel or PMChannel. If a String, it should be a Channel ID.
 * @typedef {(TextChannel|PMChannel|Server|Message|User|String)} TextChannelResolvable
*/
/**
 * If given an array, turns it into a newline-separated string.
 * @typedef {(String|Array)} StringResolvable
*/
/**
 * Resolves supplied data type to a Message. If a channel, it is the latest message from that channel.
 * @typedef {(Message|TextChannel|PMChannel)} MessageResolvable
*/
/**
 * Resolves supplied data type to a Server. If a String, it should be the server's ID.
 * @typedef {(Server|ServerChannel|Message|String)} ServerResolvable
 */
/**
 * Resolves supplied data type to something that can be attached to a message. If a String, it can be an URL or a path to a local file.
 * @typedef {(String|ReadableStream|Buffer)} FileResolvable
 */
/**
 * Resolves supplied data type to an invite ID. If a String, it should be an ID or a direct URL to the invite.
 * @typedef {(Invite|String)} InviteIDResolvable
 */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _User = require("../../Structures/User");

var _User2 = _interopRequireDefault(_User);

var _Channel = require("../../Structures/Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _TextChannel = require("../../Structures/TextChannel");

var _TextChannel2 = _interopRequireDefault(_TextChannel);

var _VoiceChannel = require("../../Structures/VoiceChannel");

var _VoiceChannel2 = _interopRequireDefault(_VoiceChannel);

var _ServerChannel = require("../../Structures/ServerChannel");

var _ServerChannel2 = _interopRequireDefault(_ServerChannel);

var _PMChannel = require("../../Structures/PMChannel");

var _PMChannel2 = _interopRequireDefault(_PMChannel);

var _Role = require("../../Structures/Role");

var _Role2 = _interopRequireDefault(_Role);

var _Server = require("../../Structures/Server");

var _Server2 = _interopRequireDefault(_Server);

var _Message = require("../../Structures/Message");

var _Message2 = _interopRequireDefault(_Message);

var _Invite = require("../../Structures/Invite");

var _Invite2 = _interopRequireDefault(_Invite);

var _Webhook = require("../../Structures/Webhook");

var _Webhook2 = _interopRequireDefault(_Webhook);

var _VoiceConnection = require("../../Voice/VoiceConnection");

var _VoiceConnection2 = _interopRequireDefault(_VoiceConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resolver = function () {
	function Resolver(internal) {
		_classCallCheck(this, Resolver);

		this.internal = internal;
	}

	_createClass(Resolver, [{
		key: "resolveToBase64",
		value: function resolveToBase64(resource) {
			if (resource instanceof Buffer) {
				resource = resource.toString("base64");
				resource = "data:image/jpg;base64," + resource;
			}
			return resource;
		}
	}, {
		key: "resolveInviteID",
		value: function resolveInviteID(resource) {
			if (resource instanceof _Invite2.default) {
				return resource.id;
			}
			if (typeof resource === "string" || resource instanceof String) {
				if (resource.indexOf("http") === 0) {
					var split = resource.split("/");
					return split.pop();
				}
				return resource;
			}
			return null;
		}
	}, {
		key: "resolveServer",
		value: function resolveServer(resource) {
			if (resource instanceof _Server2.default) {
				return resource;
			}
			if (resource instanceof _ServerChannel2.default) {
				return resource.server;
			}
			if (resource instanceof String || typeof resource === "string") {
				return this.internal.servers.get("id", resource);
			}
			if (resource instanceof _Message2.default) {
				if (resource.channel instanceof _TextChannel2.default) {
					return resource.channel.server;
				}
			}
			return null;
		}
	}, {
		key: "resolveRole",
		value: function resolveRole(resource) {
			if (resource instanceof _Role2.default) {
				return resource;
			}
			if (resource instanceof String || typeof resource === "string") {
				var role = null;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.internal.servers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var server = _step.value;

						if (role = server.roles.get("id", resource)) {
							return role;
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}
			return null;
		}
	}, {
		key: "resolveFile",
		value: function resolveFile(resource) {
			if (typeof resource === "string" || resource instanceof String) {
				if (/^https?:\/\//.test(resource)) {
					return new Promise(function (resolve, reject) {
						_superagent2.default.get(resource).buffer().parse(function (res, cb) {
							res.setEncoding("binary");
							res.data = "";
							res.on("data", function (chunk) {
								res.data += chunk;
							});
							res.on("end", function () {
								cb(null, new Buffer(res.data, "binary"));
							});
						}).end(function (err, res) {
							if (err) {
								return reject(err);
							}
							return resolve(res.body);
						});
					});
				} else {
					return Promise.resolve(resource);
				}
			}
			return Promise.resolve(resource);
		}
	}, {
		key: "resolveMentions",
		value: function resolveMentions(resource, channel) {
			var _mentions = [];
			var changed = resource;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = (resource.match(/<@\!?[0-9]+>/g) || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var mention = _step2.value;
					// username mention
					if (mention[2] === '!') {
						var user = this.internal.users.get("id", mention.substring(3, mention.length - 1));
						if (user) {
							_mentions.push(user);
							var details = channel.server && channel.server.detailsOf(user);
							if (details) {
								changed = changed.replace(new RegExp(mention, "g"), "@" + (details.nick || user.username + "#" + user.discriminator));
							}
						}
					} else {
						var user = this.internal.users.get("id", mention.substring(2, mention.length - 1));
						if (user) {
							_mentions.push(user);
							changed = changed.replace(new RegExp(mention, "g"), "@" + (user.username + "#" + user.discriminator));
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			if (channel && channel.server && channel.server.roles) {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = (resource.match(/<@&[0-9]+>/g) || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var mention = _step3.value;
						// role mention
						var role = channel.server.roles.get("id", mention.substring(3, mention.length - 1));
						if (role) {
							changed = changed.replace(new RegExp(mention, "g"), "@" + role.name);
						}
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			}
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = (resource.match(/<#[0-9]+>/g) || [])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var mention = _step4.value;
					// channel mention
					var channel = this.internal.channels.get("id", mention.substring(2, mention.length - 1));
					if (channel) {
						changed = changed.replace(new RegExp(mention, "g"), "#" + channel.name);
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return [_mentions, changed];
		}
	}, {
		key: "resolveString",
		value: function resolveString(resource) {

			// accepts Array, Channel, Server, User, Message, String and anything
			// toString()-able

			if (resource instanceof Array) {
				resource = resource.join("\n");
			}

			return resource.toString();
		}
	}, {
		key: "resolveUser",
		value: function resolveUser(resource) {
			/*
   	accepts a Message, Channel, Server, String ID, User, PMChannel
   */
			if (resource instanceof _User2.default) {
				return resource;
			}
			if (resource instanceof _Message2.default) {
				return resource.author;
			}
			if (resource instanceof _TextChannel2.default) {
				var lmsg = resource.lastMessage;
				if (lmsg) {
					return lmsg.author;
				}
			}
			if (resource instanceof _Server2.default) {
				return resource.owner;
			}
			if (resource instanceof _PMChannel2.default) {
				return resource.recipient;
			}
			if (resource instanceof String || typeof resource === "string") {
				return this.internal.users.get("id", resource);
			}

			return null;
		}
	}, {
		key: "resolveWebhook",
		value: function resolveWebhook(resource) {
			/*
    accepts a Webhook
    */
			if (resource instanceof _Webhook2.default) {
				return Promise.resolve(resource);
			}
			if (resource instanceof String || typeof resource === "string") {
				var server = this.internal.servers.find(function (s) {
					return s.webhooks.has("id", resource);
				});
				if (server) {
					return Promise.resolve(server.webhooks.get("id", resource));
				}
			}
			if ((typeof resource === "undefined" ? "undefined" : _typeof(resource)) === "object" && resource.hasOwnProperty("id") && resource.hasOwnProperty("token")) {
				return Promise.resolve(resource);
			}

			var error = new Error("Could not resolve webhook");
			error.resource = resource;
			return Promise.reject(error);
		}
	}, {
		key: "resolveMessage",
		value: function resolveMessage(resource) {
			// accepts a Message, PMChannel & TextChannel

			if (resource instanceof _TextChannel2.default || resource instanceof _PMChannel2.default) {
				return resource.lastMessage;
			}
			if (resource instanceof _Message2.default) {
				return resource;
			}

			return null;
		}
	}, {
		key: "resolveChannel",
		value: function resolveChannel(resource) {
			/*
   	accepts a Message, Channel, VoiceConnection, Server, String ID, User
   */

			if (resource instanceof _Message2.default) {
				return Promise.resolve(resource.channel);
			}
			if (resource instanceof _Channel2.default) {
				return Promise.resolve(resource);
			}
			if (resource instanceof _VoiceConnection2.default) {
				return Promise.resolve(resource.voiceChannel);
			}
			if (resource instanceof _Server2.default) {
				return Promise.resolve(resource.defaultChannel);
			}
			if (resource instanceof String || typeof resource === "string") {
				var user = this.internal.users.get("id", resource);
				if (user) {
					resource = user;
				} else {
					return Promise.resolve(this.internal.channels.get("id", resource) || this.internal.private_channels.get("id", resource));
				}
			}
			if (resource instanceof _User2.default) {
				// see if a PM exists
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = this.internal.private_channels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var pmchat = _step5.value;

						if (pmchat.recipients.length === 1 && pmchat.recipient && pmchat.recipient.equals(resource)) {
							return Promise.resolve(pmchat);
						}
					}

					// PM does not exist :\
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}

				return this.internal.startPM(resource);
			}
			var error = new Error("Could not resolve channel");
			error.resource = resource;
			return Promise.reject(error);
		}
	}]);

	return Resolver;
}();

exports.default = Resolver;
//# sourceMappingURL=Resolver.js.map
