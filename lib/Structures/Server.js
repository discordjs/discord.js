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

		data.members.forEach(function (dataUser) {
			_this.memberMap[dataUser.user.id] = {
				roles: dataUser.roles,
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

		data.roles.forEach(function (dataRole) {
			_this.roles.add(new Role(dataRole, _this));
		});
	}

	Server.prototype.toString = function toString() {
		return this.name;
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