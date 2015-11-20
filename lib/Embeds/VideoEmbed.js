"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Embed = require("./Embed.js");

var VideoEmbed = (function (_Embed) {
	_inherits(VideoEmbed, _Embed);

	function VideoEmbed(data) {
		_classCallCheck(this, VideoEmbed);

		_Embed.call(this, data);
		this.video = data.video;
		//width
		//height
		//url
	}

	return VideoEmbed;
})(Embed);

module.exports = VideoEmbed;