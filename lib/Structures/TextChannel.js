"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = require("./Channel.js");
var Cache = require("../Util/Cache.js");

var TextChannel = (function (_Channel) {
	_inherits(TextChannel, _Channel);

	function TextChannel(data, client) {
		_classCallCheck(this, TextChannel);

		_Channel.call(this, data, client);
		this.messages = new Cache("id", client.options.maximumMessages);
	}

	return TextChannel;
})(Channel);

module.exports = TextChannel;