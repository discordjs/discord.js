"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cpoc = require("child_process");

var opus;
try {
	opus = require("node-opus");
} catch (e) {
	// no opus!
}
var VoicePacket = require("./VoicePacket.js");

var AudioEncoder = (function () {
	function AudioEncoder() {
		_classCallCheck(this, AudioEncoder);

		if (opus) {
			this.opus = new opus.OpusEncoder(48000, 1);
		}
		this.choice = false;
	}

	_createClass(AudioEncoder, [{
		key: "opusBuffer",
		value: function opusBuffer(buffer) {

			return this.opus.encode(buffer, 1920);
		}
	}, {
		key: "getCommand",
		value: function getCommand(force) {

			if (this.choice && force) return choice;

			var choices = ["avconv", "ffmpeg"];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = choices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var choice = _step.value;

					var p = cpoc.spawnSync(choice);
					if (!p.error) {
						this.choice = choice;
						return choice;
					}
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

			return "help";
		}
	}, {
		key: "encodeStream",
		value: function encodeStream(stream) {
			var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err, buffer) {} : arguments[1];

			var self = this;
			return new Promise(function (resolve, reject) {
				var enc = cpoc.spawn(self.getCommand(), ["-f", "s16le", "-ar", "48000", "-ac", "1", // this can be 2 but there's no point, discord makes it mono on playback, wasted bandwidth.
				"-af", "volume=1", "pipe:1", "-i", "-"]);

				stream.pipe(enc.stdin);

				enc.stdout.once("readable", function () {
					callback(null, {
						proc: enc,
						stream: enc.stdout,
						instream: stream
					});
					resolve({
						proc: enc,
						stream: enc.stdout,
						instream: stream
					});
				});

				enc.stdout.on("end", function () {
					callback("end");
					reject("end");
				});

				enc.stdout.on("close", function () {
					callback("close");
					reject("close");
				});
			});
		}
	}, {
		key: "encodeFile",
		value: function encodeFile(file) {
			var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err, buffer) {} : arguments[1];

			var self = this;
			return new Promise(function (resolve, reject) {
				var enc = cpoc.spawn(self.getCommand(), ["-f", "s16le", "-ar", "48000", "-ac", "1", // this can be 2 but there's no point, discord makes it mono on playback, wasted bandwidth.
				"-af", "volume=1", "pipe:1", "-i", file]);

				enc.stdout.once("readable", function () {
					callback(null, {
						proc: enc,
						stream: enc.stdout
					});
					resolve({
						proc: enc,
						stream: enc.stdout
					});
				});

				enc.stdout.on("end", function () {
					callback("end");
					reject("end");
				});

				enc.stdout.on("close", function () {
					callback("close");
					reject("close");
				});
			});
		}
	}]);

	return AudioEncoder;
})();

module.exports = AudioEncoder;