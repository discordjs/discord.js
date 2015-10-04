"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServerPermissions = require("./ServerPermissions.js");
var Member = require("./Member.js");

var Server = (function () {
	function Server(data, client) {
		_classCallCheck(this, Server);

		this.client = client;
		this.region = data.region;
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.id = data.id;
		this.members = [];
		this.channels = [];
		this.icon = data.icon;
		this.afkTimeout = data.afk_timeout;
		this.afkChannelId = data.afk_channel_id;

		this.roles = [];

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = data.roles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var permissionGroup = _step.value;

				this.roles.push(new ServerPermissions(permissionGroup));
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		if (!data.members) {
			data.members = [client.user];
			return;
		}

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = data.members[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var member = _step2.value;

				// first we cache the user in our Discord Client,
				// then we add it to our list. This way when we
				// get a user from this server's member list,
				// it will be identical (unless an async change occurred)
				// to the client's cache.
				if (member.user) this.addMember(client.addUser(member.user), member.roles);
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
					_iterator2["return"]();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	}

	_createClass(Server, [{
		key: "getRole",

		// get/set

		value: function getRole(id) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.roles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var role = _step3.value;

					if (role.id === id) {
						return role;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
						_iterator3["return"]();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return null;
		}
	}, {
		key: "updateRole",
		value: function updateRole(data) {

			var oldRole = this.getRole(data.id);

			if (oldRole) {

				var index = this.roles.indexOf(oldRole);
				this.roles[index] = new ServerPermissions(data);

				return this.roles[index];
			} else {
				return false;
			}
		}
	}, {
		key: "removeRole",
		value: function removeRole(id) {
			for (var roleId in this.roles) {
				if (this.roles[roleId].id === id) {
					this.roles.splice(roleId, 1);
				}
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.members[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var member = _step4.value;

					for (var roleId in member.rawRoles) {
						if (member.rawRoles[roleId] === id) {
							member.rawRoles.splice(roleId, 1);
						}
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
						_iterator4["return"]();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
	}, {
		key: "getChannel",
		value: function getChannel(key, value) {
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.channels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var channel = _step5.value;

					if (channel[key] === value) {
						return channel;
					}
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
						_iterator5["return"]();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			return null;
		}
	}, {
		key: "getMember",
		value: function getMember(key, value) {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this.members[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var member = _step6.value;

					if (member[key] === value) {
						return member;
					}
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
						_iterator6["return"]();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return null;
		}
	}, {
		key: "removeMember",
		value: function removeMember(key, value) {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = this.members[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var member = _step7.value;

					if (member[key] === value) {
						this.members.splice(key, 1);
						return member;
					}
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
						_iterator7["return"]();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return false;
		}
	}, {
		key: "addChannel",
		value: function addChannel(chann) {
			if (!this.getChannel("id", chann.id)) {
				this.channels.push(chann);
			}
			return chann;
		}
	}, {
		key: "addMember",
		value: function addMember(user, roles) {
			if (!this.getMember("id", user.id)) {
				var mem = new Member(user, this, roles);
				this.members.push(mem);
			}
			return mem;
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.name;
		}
	}, {
		key: "equals",
		value: function equals(object) {
			return object.id === this.id;
		}
	}, {
		key: "permissionGroups",
		get: function get() {
			return this.roles;
		}
	}, {
		key: "permissions",
		get: function get() {
			return this.roles;
		}
	}, {
		key: "iconURL",
		get: function get() {
			if (!this.icon) return null;
			return "https://discordapp.com/api/guilds/" + this.id + "/icons/" + this.icon + ".jpg";
		}
	}, {
		key: "afkChannel",
		get: function get() {
			if (!this.afkChannelId) return false;

			return this.getChannel("id", this.afkChannelId);
		}
	}, {
		key: "defaultChannel",
		get: function get() {
			return this.getChannel("name", "general");
		}
	}, {
		key: "owner",
		get: function get() {
			return this.client.getUser("id", this.ownerID);
		}
	}, {
		key: "users",
		get: function get() {
			return this.members;
		}
	}]);

	return Server;
})();

module.exports = Server;