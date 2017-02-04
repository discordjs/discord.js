"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Channel2 = require("./Channel");

var _Channel3 = _interopRequireDefault(_Channel2);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _PermissionOverwrite = require("./PermissionOverwrite");

var _PermissionOverwrite2 = _interopRequireDefault(_PermissionOverwrite);

var _ChannelPermissions = require("./ChannelPermissions");

var _ChannelPermissions2 = _interopRequireDefault(_ChannelPermissions);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServerChannel = function (_Channel) {
	_inherits(ServerChannel, _Channel);

	function ServerChannel(data, client, server) {
		_classCallCheck(this, ServerChannel);

		var _this = _possibleConstructorReturn(this, (ServerChannel.__proto__ || Object.getPrototypeOf(ServerChannel)).call(this, data, client));

		_this.name = data.name;
		_this.type = data.type;
		_this.position = data.position;
		_this.permissionOverwrites = data.permissionOverwrites || new _Cache2.default();
		_this.server = server;
		if (!data.permissionOverwrites) {
			data.permission_overwrites.forEach(function (permission) {
				_this.permissionOverwrites.add(new _PermissionOverwrite2.default(permission));
			});
		}
		return _this;
	}

	_createClass(ServerChannel, [{
		key: "toObject",
		value: function toObject() {
			var keys = ['id', 'name', 'type', 'position'],
			    obj = {};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var k = _step.value;

					obj[k] = this[k];
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

			obj.permissionOverwrites = this.permissionOverwrites.map(function (p) {
				return p.toObject();
			});

			return obj;
		}
	}, {
		key: "permissionsOf",
		value: function permissionsOf(userOrRole) {
			userOrRole = this.client.internal.resolver.resolveUser(userOrRole);
			if (userOrRole) {
				if (this.server.ownerID === userOrRole.id) {
					return new _ChannelPermissions2.default(4294967295);
				}
				var everyoneRole = this.server.roles.get("id", this.server.id);

				var userRoles = [everyoneRole].concat(this.server.rolesOf(userOrRole) || []);
				var userRolesID = userRoles.filter(function (v) {
					return !!v;
				}).map(function (v) {
					return v.id;
				});
				var roleOverwrites = [],
				    memberOverwrites = [];

				this.permissionOverwrites.forEach(function (overwrite) {
					if (overwrite.type === "member" && overwrite.id === userOrRole.id) {
						memberOverwrites.push(overwrite);
					} else if (overwrite.type === "role" && ~userRolesID.indexOf(overwrite.id)) {
						roleOverwrites.push(overwrite);
					}
				});

				var permissions = 0;

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = userRoles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var serverRole = _step2.value;

						if (serverRole) {
							permissions |= serverRole.permissions;
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

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = roleOverwrites.concat(memberOverwrites)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var overwrite = _step3.value;

						if (overwrite) {
							permissions = permissions & ~overwrite.deny;
							permissions = permissions | overwrite.allow;
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

				return new _ChannelPermissions2.default(permissions);
			} else {
				userOrRole = this.client.internal.resolver.resolveRole(userOrRole);
				if (userOrRole) {
					var permissions = this.server.roles.get("id", this.server.id).permissions | userOrRole.permissions;
					var overwrite = this.permissionOverwrites.get("id", this.server.id);
					permissions = permissions & ~overwrite.deny | overwrite.allow;
					overwrite = this.permissionOverwrites.get("id", userOrRole.id);
					if (overwrite) {
						permissions = permissions & ~overwrite.deny | overwrite.allow;
					}
					return new _ChannelPermissions2.default(permissions);
				} else {
					return null;
				}
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
			return this.client.setChannelName.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "setPosition",
		value: function setPosition() {
			return this.client.setChannelPosition.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "update",
		value: function update() {
			return this.client.updateChannel.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}]);

	return ServerChannel;
}(_Channel3.default);

exports.default = ServerChannel;
//# sourceMappingURL=ServerChannel.js.map
