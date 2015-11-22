"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = require("./Channel.js");
var Cache = require("../Util/Cache.js");
var PermissionOverwrite = require("./PermissionOverwrite.js");
var ChannelPermissions = require("./ChannelPermissions.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;

var ServerChannel = (function (_Channel) {
	_inherits(ServerChannel, _Channel);

	function ServerChannel(data, client, server) {
		_classCallCheck(this, ServerChannel);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ServerChannel).call(this, data, client));

		_this.name = data.name;
		_this.type = data.type;
		_this.position = data.position;
		_this.permissionOverwrites = new Cache();
		_this.server = server;
		data.permission_overwrites.forEach(function (permission) {
			_this.permissionOverwrites.add(new PermissionOverwrite(permission));
		});
		return _this;
	}

	_createClass(ServerChannel, [{
		key: "permissionsOf",
		value: function permissionsOf(user) {
			user = this.client.internal.resolver.resolveUser(user);
			if (user) {
				if (this.server.owner.equals(user)) {
					return new ChannelPermissions(4294967295);
				}
				var everyoneRole = this.server.roles.get("name", "@everyone");

				var userRoles = [everyoneRole].concat(this.server.rolesOf(user) || []);
				var userRolesID = userRoles.map(function (v) {
					return v.id;
				});
				var roleOverwrites = [],
				    memberOverwrites = [];

				this.permissionOverwrites.forEach(function (overwrite) {
					if (overwrite.type === "member" && overwrite.id === user.id) {
						memberOverwrites.push(overwrite);
					} else if (overwrite.type === "role" && overwrite.id in userRolesID) {
						roleOverwrites.push(overwrite);
					}
				});

				var permissions = 0;

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = userRoles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var serverRole = _step.value;

						permissions |= serverRole.permissions;
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

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = roleOverwrites.concat(memberOverwrites)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var overwrite = _step2.value;

						permissions = permissions & ~overwrite.deny;
						permissions = permissions | overwrite.allow;
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

				return new ChannelPermissions(permissions);
			} else {
				return null;
			}
		}
	}, {
		key: "permsOf",
		value: function permsOf(user) {
			return this.permissionsOf(user);
		}
	}, {
		key: "mention",
		value: function mention() {
			return "<#" + this.id + ">";
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.mention();
		}
	}, {
		key: "setName",
		value: function setName() {
			return this.client.setChannelName.apply(this.client, reg(this, arguments));
		}
	}]);

	return ServerChannel;
})(Channel);

module.exports = ServerChannel;