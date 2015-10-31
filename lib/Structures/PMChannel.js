"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = require("./Channel.js");
var Equality = require("../Util/Equality.js");

var PMChannel = (function (_Channel) {
	_inherits(PMChannel, _Channel);

	function PMChannel(data, client) {
		_classCallCheck(this, PMChannel);

		_Channel.call(this, data, client);
	}

	return PMChannel;
})(Channel);

module.exports = PMChannel;