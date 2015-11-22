"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Equality = require("../Util/Equality.js");
var Endpoints = require("../Constants.js").Endpoints;
var Cache = require("../Util/Cache.js");
var User = require("./User.js");
var TextChannel = require("./TextChannel.js");
var VoiceChannel = require("./VoiceChannel.js");
var Role = require("./Role.js");

var strictKeys = ["region", "ownerID", "name", "id", "icon", "afkTimeout", "afkChannelID"];

var Server = (function (_Equality) {
	_inherits(Server, _Equality);

	function Server(data, client) {
		_classCallCheck(this, Server);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Server).call(this));

		var self = _this;
		_this.client = client;

		_this.region = data.region;
		_this.ownerID = data.owner_id;
		_this.name = data.name;
		_this.id = data.id;
		_this.members = new Cache();
		_this.channels = new Cache();
		_this.roles = new Cache();
		_this.icon = data.icon;
		_this.afkTimeout = data.afkTimeout;
		_this.afkChannelID = data.afk_channel_id;
		_this.memberMap = {};

		var self = _this;

		data.roles.forEach(function (dataRole) {
			_this.roles.add(new Role(dataRole, _this, client));
		});

		data.members.forEach(function (dataUser) {
			_this.memberMap[dataUser.user.id] = {
				roles: dataUser.roles.map(function (pid) {
					return self.roles.get("id", pid);
				}),
				mute: dataUser.mute,
				deaf: dataUser.deaf,
				joinedAt: Date.parse(dataUser.joined_at)
			};
			var user = client.internal.users.add(new User(dataUser.user, client));
			_this.members.add(user);
		});

		data.channels.forEach(function (dataChannel) {
			if (dataChannel.type === "text") {
				var channel = client.internal.channels.add(new TextChannel(dataChannel, client, _this));
				_this.channels.add(channel);
			} else {
				var channel = client.internal.channels.add(new VoiceChannel(dataChannel, client, _this));
				_this.channels.add(channel);
			}
		});

		if (data.presences) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = data.presences[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var presence = _step.value;

					var user = client.internal.users.get("id", presence.user.id);
					if (user) {
						user.status = presence.status;
						user.gameID = presence.game_id;
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
		return _this;
	}

	_createClass(Server, [{
		key: "rolesOfUser",
		value: function rolesOfUser(user) {
			user = this.client.internal.resolver.resolveUser(user);
			if (user) {
				return this.memberMap[user.id] ? this.memberMap[user.id].roles : [];
			} else {
				return null;
			}
		}
	}, {
		key: "rolesOf",
		value: function rolesOf(user) {
			return this.rolesOfUser(user);
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.name;
		}
	}, {
		key: "equalsStrict",
		value: function equalsStrict(obj) {
			if (obj instanceof Server) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = strictKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var key = _step2.value;

						if (obj[key] !== this[key]) {
							return false;
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
			} else {
				return false;
			}
			return true;
		}
	}, {
		key: "iconURL",
		get: function get() {
			if (!this.icon) {
				return null;
			} else {
				return Endpoints.SERVER_ICON(this.id, this.icon);
			}
		}
	}, {
		key: "afkChannel",
		get: function get() {
			return this.channels.get("id", this.afkChannelID);
		}
	}, {
		key: "defaultChannel",
		get: function get() {
			return this.channels.get("id", this.id);
		}
	}, {
		key: "owner",
		get: function get() {
			return this.members.get("id", this.ownerID);
		}
	}]);

	return Server;
})(Equality);

module.exports = Server;