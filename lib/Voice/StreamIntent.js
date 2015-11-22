"use strict"
// represents an intent of streaming music
;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require("events");

var StreamIntent = (function (_EventEmitter) {
	_inherits(StreamIntent, _EventEmitter);

	function StreamIntent() {
		_classCallCheck(this, StreamIntent);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(StreamIntent).call(this));
	}

	return StreamIntent;
})(EventEmitter);

module.exports = StreamIntent;