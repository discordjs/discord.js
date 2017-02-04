"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ServerChannel2 = require("./ServerChannel");

var _ServerChannel3 = _interopRequireDefault(_ServerChannel2);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VoiceChannel = function (_ServerChannel) {
	_inherits(VoiceChannel, _ServerChannel);

	function VoiceChannel(data, client, server) {
		_classCallCheck(this, VoiceChannel);

		var _this = _possibleConstructorReturn(this, (VoiceChannel.__proto__ || Object.getPrototypeOf(VoiceChannel)).call(this, data, client, server));

		_this.members = data.members || new _Cache2.default();
		_this.userLimit = data.user_limit || 0;
		_this._bitrate = data.bitrate || 64000; // incase somebody wants to access the bps value???
		_this.bitrate = Math.round(_this._bitrate / 1000); // store as kbps
		return _this;
	}

	_createClass(VoiceChannel, [{
		key: "toObject",
		value: function toObject() {
			var obj = _get(VoiceChannel.prototype.__proto__ || Object.getPrototypeOf(VoiceChannel.prototype), "toObject", this).call(this);

			obj.userLimit = this.userLimit;
			obj.bitrate = this.bitrate;
			obj.members = this.members.map(function (member) {
				return member.toObject();
			});

			return obj;
		}
	}, {
		key: "join",
		value: function join() {
			var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			return this.client.joinVoiceChannel.apply(this.client, [this, callback]);
		}
	}, {
		key: "setUserLimit",
		value: function setUserLimit() {
			return this.client.setChannelUserLimit.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "setBitrate",
		value: function setBitrate() {
			return this.client.setChannelBitrate.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}]);

	return VoiceChannel;
}(_ServerChannel3.default);

exports.default = VoiceChannel;
//# sourceMappingURL=VoiceChannel.js.map
