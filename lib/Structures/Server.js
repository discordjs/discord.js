"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		var _this = this;

		_classCallCheck(this, Server);

		_Equality.call(this);

		var self = this;
		this.client = client;

		this.region = data.region;
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.id = data.id;
		this.members = new Cache();
		this.channels = new Cache();
		this.roles = new Cache();
		this.icon = data.icon;
		this.afkTimeout = data.afkTimeout;
		this.afkChannelID = data.afk_channel_id;
		this.memberMap = {};

		var self = this;

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
			for (var _iterator = data.presences, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var presence = _ref;

				var user = client.internal.users.get("id", presence.user.id);
				if (user) {
					user.status = presence.status;
					user.gameID = presence.game_id;
				}
			}
		}
	}

	Server.prototype.rolesOfUser = function rolesOfUser(user) {
		user = this.client.internal.resolver.resolveUser(user);
		if (user) {
			return this.memberMap[user.id] ? this.memberMap[user.id].roles : [];
		} else {
			return null;
		}
	};

	Server.prototype.rolesOf = function rolesOf(user) {
		return this.rolesOfUser(user);
	};

	Server.prototype.toString = function toString() {
		return this.name;
	};

	Server.prototype.equalsStrict = function equalsStrict(obj) {
		if (obj instanceof Server) {
			for (var _iterator2 = strictKeys, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var key = _ref2;

				if (obj[key] !== this[key]) {
					return false;
				}
			}
		} else {
			return false;
		}
		return true;
	};

	_createClass(Server, [{
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