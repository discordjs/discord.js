"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Equality = require("../Util/Equality.js");
var Endpoints = require("../Constants.js").Endpoints;

var User = (function (_Equality) {
	_inherits(User, _Equality);

	function User(data, client) {
		_classCallCheck(this, User);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(User).call(this));

		_this.client = client;
		_this.username = data.username;
		_this.discriminator = data.discriminator;
		_this.id = data.id;
		_this.avatar = data.avatar;
		_this.status = data.status || "offline";
		_this.gameID = data.game_id || null;
		_this.typing = {
			since: null,
			channel: null
		};
		return _this;
	}

	_createClass(User, [{
		key: "mention",
		value: function mention() {
			return "<@" + this.id + ">";
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.mention();
		}
	}, {
		key: "equalsStrict",
		value: function equalsStrict(obj) {
			if (obj instanceof User) return this.id === obj.id && this.username === obj.username && this.discriminator === obj.discriminator && this.avatar === obj.avatar && this.status === obj.status && this.gameID === obj.gameID;else return false;
		}
	}, {
		key: "avatarURL",
		get: function get() {
			if (!this.avatar) {
				return null;
			} else {
				return Endpoints.AVATAR(this.id, this.avatar);
			}
		}
	}]);

	return User;
})(Equality);

module.exports = User;