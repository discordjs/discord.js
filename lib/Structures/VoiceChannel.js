"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServerChannel = require("./ServerChannel.js");

var VoiceChannel = (function (_ServerChannel) {
	_inherits(VoiceChannel, _ServerChannel);

	function VoiceChannel(data, client, server) {
		_classCallCheck(this, VoiceChannel);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(VoiceChannel).call(this, data, client, server));
	}

	return VoiceChannel;
})(ServerChannel);

module.exports = VoiceChannel;