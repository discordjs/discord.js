"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var opus;
try {
	opus = require("node-opus");
} catch (e) {
	// no opus!
}

var AudioEncoder = (function () {
	function AudioEncoder() {
		_classCallCheck(this, AudioEncoder);

		if (opus) {
			this.opus = new opus.OpusEncoder(48000, 1);
		}
		this.choice = false;
	}

	AudioEncoder.prototype.opusBuffer = function opusBuffer(buffer) {

		return this.opus.encode(buffer, 1920);
	};

	AudioEncoder.prototype.getCommand = function getCommand(force) {

		if (this.choice && force) return choice;

		var choices = ["avconv", "ffmpeg"];

		for (var _iterator = choices, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var choice = _ref;

			var p = _child_process2["default"].spawnSync(choice);
			if (!p.error) {
				this.choice = choice;
				return choice;
			}
		}

		return "help";
	};

	AudioEncoder.prototype.encodeStream = function encodeStream(stream) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err, buffer) {} : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {
			var enc = _child_process2["default"].spawn(self.getCommand(), ['-i', "-", '-f', 's16le', '-ar', '48000', '-ac', 1, 'pipe:1']);

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
	};

	AudioEncoder.prototype.encodeFile = function encodeFile(file) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err, buffer) {} : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {
			var enc = _child_process2["default"].spawn(self.getCommand(), ['-i', file, '-f', 's16le', '-ar', '48000', '-ac', 1, 'pipe:1']);

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
				console.log("end");
				callback("end");
				reject("end");
			});

			enc.stdout.on("close", function () {
				console.log("close");
				callback("close");
				reject("close");
			});
		});
	};

	return AudioEncoder;
})();

exports["default"] = AudioEncoder;
module.exports = exports["default"];
