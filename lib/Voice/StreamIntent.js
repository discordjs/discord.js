"use strict";
// represents an intent of streaming music

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require("events");

var StreamIntent = (function (_EventEmitter) {
	_inherits(StreamIntent, _EventEmitter);

	function StreamIntent() {
		_classCallCheck(this, StreamIntent);

		_EventEmitter.call(this);
	}

	return StreamIntent;
})(EventEmitter);

module.exports = StreamIntent;