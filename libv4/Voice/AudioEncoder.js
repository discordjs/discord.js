"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _VolumeTransformer = require("./VolumeTransformer");

var _VolumeTransformer2 = _interopRequireDefault(_VolumeTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var opus;
try {
	opus = require("node-opus");
} catch (e) {
	// no opus!
}

var AudioEncoder = function () {
	function AudioEncoder() {
		_classCallCheck(this, AudioEncoder);

		if (opus) {
			this.opus = new opus.OpusEncoder(48000, 2);
		}
		this.choice = false;
		this.sanityCheckPassed = undefined;
	}

	_createClass(AudioEncoder, [{
		key: "sanityCheck",
		value: function sanityCheck() {
			var _opus = this.opus;
			var encodeZeroes = function encodeZeroes() {
				try {
					var zeroes = new Buffer(1920);
					zeroes.fill(0);
					return _opus.encode(zeroes, 1920).readUIntBE(0, 3);
				} catch (err) {
					return false;
				}
			};
			if (this.sanityCheckPassed === undefined) this.sanityCheckPassed = encodeZeroes() === 16056318;
			return this.sanityCheckPassed;
		}
	}, {
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

					var p = _child_process2.default.spawnSync(choice);
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

			return;
		}
	}, {
		key: "encodeStream",
		value: function encodeStream(stream, options) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_this.volume = new _VolumeTransformer2.default(options.volume);

				var command = _this.getCommand();

				// check if avconv or ffmpeg were found.
				if (!command) return reject(new Error('FFMPEG not found. Make sure it is installed and in path.'));

				var enc = _child_process2.default.spawn(command, ['-i', '-', '-f', 's16le', '-ar', '48000', '-ss', options.seek || 0, '-ac', 2, 'pipe:1']);

				var dest = stream.pipe(enc.stdin);

				dest.on('unpipe', function () {
					return dest.destroy();
				});
				dest.on('error', function (err) {
					return dest.destroy();
				});

				_this.hookEncodingProcess(resolve, reject, enc, stream);
			});
		}
	}, {
		key: "encodeFile",
		value: function encodeFile(file, options) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2.volume = new _VolumeTransformer2.default(options.volume);

				var command = _this2.getCommand();

				// check if avconv or ffmpeg were found.
				if (!command) return reject(new Error('FFMPEG not found. Make sure it is installed and in path.'));

				var enc = _child_process2.default.spawn(command, ['-i', file, '-f', 's16le', '-ar', '48000', '-ss', options.seek || 0, '-ac', 2, 'pipe:1']);

				_this2.hookEncodingProcess(resolve, reject, enc);
			});
		}
	}, {
		key: "encodeArbitraryFFmpeg",
		value: function encodeArbitraryFFmpeg(ffmpegOptions, options) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_this3.volume = new _VolumeTransformer2.default(options.volume);

				var command = _this3.getCommand();

				// check if avconv or ffmpeg were found.
				if (!command) return reject(new Error('FFMPEG not found. Make sure it is installed and in path.'));

				// add options discord.js needs
				ffmpegOptions = ffmpegOptions.concat(['-f', 's16le', '-ar', '48000', '-ac', 2, 'pipe:1']);
				var enc = _child_process2.default.spawn(command, ffmpegOptions);

				_this3.hookEncodingProcess(resolve, reject, enc);
			});
		}
	}, {
		key: "hookEncodingProcess",
		value: function hookEncodingProcess(resolve, reject, enc, stream) {
			var _this4 = this;

			var processKilled = false;

			function killProcess(cause) {
				if (processKilled) return;

				enc.stdin.pause();
				enc.kill("SIGKILL");

				processKilled = true;

				reject(cause);
			}

			var ffmpegErrors = "";

			enc.stdout.pipe(this.volume);

			enc.stderr.on("data", function (data) {
				ffmpegErrors += "\n" + new Buffer(data).toString().trim();
			});

			enc.stdout.once("end", function () {
				killProcess("end");
			});

			enc.stdout.once("error", function () {
				enc.stdout.emit("end");
			});

			enc.once("exit", function (code, signal) {
				if (code) {
					reject(new Error("FFMPEG: " + ffmpegErrors));
				}
			});

			this.volume.once("readable", function () {
				var data = {
					proc: enc,
					stream: _this4.volume,
					channels: 2
				};

				if (stream) {
					data.instream = stream;
				}

				resolve(data);
			});

			this.volume.once("end", function () {
				killProcess("end");
			});

			this.volume.once("error", function () {
				killProcess("end");
			});

			this.volume.on("end", function () {
				killProcess("end");
			});

			this.volume.on("close", function () {
				killProcess("close");
			});
		}
	}]);

	return AudioEncoder;
}();

exports.default = AudioEncoder;
//# sourceMappingURL=AudioEncoder.js.map
