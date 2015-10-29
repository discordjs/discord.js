"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Embed = require("./Embed.js");

var LinkEmbed = (function (_Embed) {
	_inherits(LinkEmbed, _Embed);

	function LinkEmbed(data) {
		_classCallCheck(this, LinkEmbed);

		_Embed.call(this, data);
	}

	return LinkEmbed;
})(Embed);

module.exports = LinkEmbed;