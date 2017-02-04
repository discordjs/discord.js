"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require("../Constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PermissionOverwrite = function () {
	function PermissionOverwrite(data) {
		_classCallCheck(this, PermissionOverwrite);

		this.id = data.id;
		this.type = data.type; // member or role
		this.deny = data.deny;
		this.allow = data.allow;
	}

	// returns an array of allowed permissions


	_createClass(PermissionOverwrite, [{
		key: "toObject",
		value: function toObject() {
			var keys = ['id', 'type', 'allow', 'deny'],
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

			return obj;
		}
	}, {
		key: "setAllowed",
		value: function setAllowed(allowedArray) {
			var _this = this;

			allowedArray.forEach(function (permission) {
				if (permission instanceof String || typeof permission === "string") {
					permission = _Constants.Permissions[permission];
				}
				if (permission) {
					_this.allow |= 1 << permission;
				}
			});
		}
	}, {
		key: "setDenied",
		value: function setDenied(deniedArray) {
			var _this2 = this;

			deniedArray.forEach(function (permission) {
				if (permission instanceof String || typeof permission === "string") {
					permission = _Constants.Permissions[permission];
				}
				if (permission) {
					_this2.deny |= 1 << permission;
				}
			});
		}
	}, {
		key: "allowed",
		get: function get() {
			var allowed = [];
			for (var permName in _Constants.Permissions) {
				if (permName === "manageRoles" || permName === "manageChannels") {
					// these permissions do not exist in overwrites.
					continue;
				}

				if (!!(this.allow & _Constants.Permissions[permName])) {
					allowed.push(permName);
				}
			}
			return allowed;
		}

		// returns an array of denied permissions

	}, {
		key: "denied",
		get: function get() {
			var denied = [];
			for (var permName in _Constants.Permissions) {
				if (permName === "manageRoles" || permName === "manageChannels") {
					// these permissions do not exist in overwrites.
					continue;
				}

				if (!!(this.deny & _Constants.Permissions[permName])) {
					denied.push(permName);
				}
			}
			return denied;
		}
	}]);

	return PermissionOverwrite;
}();

exports.default = PermissionOverwrite;
//# sourceMappingURL=PermissionOverwrite.js.map
