"use strict"
/* global Buffer */

;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs");

var User = require("../../Structures/User.js"),
    Channel = require("../../Structures/Channel.js"),
    TextChannel = require("../../Structures/TextChannel.js"),
    VoiceChannel = require("../../Structures/VoiceChannel.js"),
    ServerChannel = require("../../Structures/ServerChannel.js"),
    PMChannel = require("../../Structures/PMChannel.js"),
    Server = require("../../Structures/Server.js"),
    Message = require("../../Structures/Message.js"),
    Invite = require("../../Structures/Invite.js"),
    Games = require("../../../ref/gameMap.js");

var Resolver = (function () {
	function Resolver(internal) {
		_classCallCheck(this, Resolver);

		this.internal = internal;
	}

	_createClass(Resolver, [{
		key: "resolveGameID",
		value: function resolveGameID(resource) {
			if (!isNaN(resource) && parseInt(resource) % 1 === 0) {
				return resource;
			} else if (typeof resource == "string" || resource instanceof String) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {

					for (var _iterator = Games[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var game = _step.value;

						if (game.name.toUpperCase() === resource.toUpperCase()) {
							return game.id;
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
			if (resource instanceof Invite) {
				return resource.id;
			} else if (typeof resource == "string" || resource instanceof String) {

				if (resource.indexOf("http") === 0) {
					var split = resource.split("/");
					return split.pop();
				} else {
					return resource;
				}
			}
			return null;
		}
	}, {
		key: "resolveServer",
		value: function resolveServer(resource) {
			if (resource instanceof Server) {
				return resource;
			} else if (resource instanceof ServerChannel) {
				return resource.server;
			} else if (resource instanceof String || typeof resource === "string") {
				return this.internal.servers.get("id", resource);
			} else if (resource instanceof Message) {
				if (resource.channel instanceof TextChannel) {
					return resource.server;
				}
			}
			return null;
		}
	}, {
		key: "resolveFile",
		value: function resolveFile(resource) {
			if (typeof resource === "string" || resource instanceof String) {
				return fs.createReadStream(resource);
			} else {
				return resource;
			}
		}
	}, {
		key: "resolveMentions",
		value: function resolveMentions(resource) {
			// resource is a string
			var _mentions = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = (resource.match(/<@[^>]*>/g) || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var mention = _step2.value;

					_mentions.push(mention.substring(2, mention.length - 1));
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

			return _mentions;
		}
	}, {
		key: "resolveString",
		value: function resolveString(resource) {

			// accepts Array, Channel, Server, User, Message, String and anything
			// toString()-able

			var final = resource;
			if (resource instanceof Array) {
				final = resource.join("\n");
			}

			return final.toString();
		}
	}, {
		key: "resolveUser",
		value: function resolveUser(resource) {
			/*
   	accepts a Message, Channel, Server, String ID, User, PMChannel
   */
			var found = null;
			if (resource instanceof User) {
				found = resource;
			} else if (resource instanceof Message) {
				found = resource.author;
			} else if (resource instanceof TextChannel) {
				var lmsg = resource.lastMessage;
				if (lmsg) {
					found = lmsg.author;
				}
			} else if (resource instanceof Server) {
				found = resource.owner;
			} else if (resource instanceof PMChannel) {
				found = resource.recipient;
			} else if (resource instanceof String || typeof resource === "string") {
				found = this.client.internal.users.get("id", resource);
			}

			return found;
		}
	}, {
		key: "resolveMessage",
		value: function resolveMessage(resource) {
			// accepts a Message, PMChannel & TextChannel
			var found = null;

			if (resource instanceof TextChannel || resource instanceof PMChannel) {
				found = resource.lastMessage;
			} else if (resource instanceof Message) {
				found = resource;
			}

			return found;
		}
	}, {
		key: "resolveVoiceChannel",
		value: function resolveVoiceChannel(resource) {
			// resolveChannel will also work but this is more apt
			if (resource instanceof VoiceChannel) {
				return resource;
			}
			return null;
		}
	}, {
		key: "resolveChannel",
		value: function resolveChannel(resource) {
			/*
   	accepts a Message, Channel, Server, String ID, User
    */
			var self = this;

			return new Promise(function (resolve, reject) {
				var found = null;
				if (resource instanceof Message) {
					found = resource.channel;
				} else if (resource instanceof Channel) {
					found = resource;
				} else if (resource instanceof Server) {
					found = resource.channels.get("id", resource.id);
				} else if (resource instanceof String || typeof resource === "string") {
					found = self.internal.channels.get("id", resource);
				} else if (resource instanceof User) {
					// see if a PM exists
					var chatFound = false;
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = self.internal.private_channels[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var pmchat = _step3.value;

							if (pmchat.recipient.equals(resource)) {
								chatFound = pmchat;
								break;
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

					if (chatFound) {
						// a PM already exists!
						found = chatFound;
					} else {
						// PM does not exist :\
						self.internal.startPM(resource).then(function (pmchannel) {
							return resolve(pmchannel);
						}).catch(function (e) {
							return reject(e);
						});
						return;
					}
				}
				if (found) resolve(found);else reject(new Error("Didn't found anything"));
			});
		}
	}]);

	return Resolver;
})();

module.exports = Resolver;