"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _VolumeTransformer = require("./VolumeTransformer");

var _VolumeTransformer2 = _interopRequireDefault(_VolumeTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var opus;
try {
	opus = require("node-opus");
} catch (e) {
	// no opus!
}

class AudioEncoder {
	constructor() {
		if (opus) {
			this.opus = new opus.OpusEncoder(48000, 2);
		}
		this.choice = false;
		this.sanityCheckPassed = undefined;
	}

	sanityCheck() {
		var _opus = this.opus;
		var encodeZeroes = function () {
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

	opusBuffer(buffer) {

		return this.opus.encode(buffer, 1920);
	}

	getCommand(force) {
		if (this.choice && force) return choice;

		var choices = ["avconv", "ffmpeg"];

		for (var choice of choices) {
			var p = _child_process2.default.spawnSync(choice);
			if (!p.error) {
				this.choice = choice;
				return choice;
			}
		}

		return;
	}

	encodeStream(stream, options) {
		return new Promise((resolve, reject) => {
			this.volume = new _VolumeTransformer2.default(options.volume);

			var command = this.getCommand();

			// check if avconv or ffmpeg were found.
			if (!command) return reject(new Error('FFMPEG not found. Make sure it is installed and in path.'));

			var enc = _child_process2.default.spawn(command, ['-i', '-', '-f', 's16le', '-ar', '48000', '-ss', options.seek || 0, '-ac', 2, 'pipe:1']);

			var dest = stream.pipe(enc.stdin);

			dest.on('unpipe', () => dest.destroy());
			dest.on('error', err => dest.destroy());

			this.hookEncodingProcess(resolve, reject, enc, stream);
		});
	}

	encodeFile(file, options) {
		return new Promise((resolve, reject) => {
			this.volume = new _VolumeTransformer2.default(options.volume);

			var command = this.getCommand();

			// check if avconv or ffmpeg were found.
			if (!command) return reject(new Error('FFMPEG not found. Make sure it is installed and in path.'));

			var enc = _child_process2.default.spawn(command, ['-i', file, '-f', 's16le', '-ar', '48000', '-ss', options.seek || 0, '-ac', 2, 'pipe:1']);

			this.hookEncodingProcess(resolve, reject, enc);
		});
	}

	encodeArbitraryFFmpeg(ffmpegOptions, options) {
		return new Promise((resolve, reject) => {
			this.volume = new _VolumeTransformer2.default(options.volume);

			var command = this.getCommand();

			// check if avconv or ffmpeg were found.
			if (!command) return reject(new Error('FFMPEG not found. Make sure it is installed and in path.'));

			// add options discord.js needs
			ffmpegOptions = ffmpegOptions.concat(['-f', 's16le', '-ar', '48000', '-ac', 2, 'pipe:1']);
			var enc = _child_process2.default.spawn(command, ffmpegOptions);

			this.hookEncodingProcess(resolve, reject, enc);
		});
	}

	hookEncodingProcess(resolve, reject, enc, stream) {
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

		enc.stderr.on("data", data => {
			ffmpegErrors += "\n" + new Buffer(data).toString().trim();
		});

		enc.stdout.once("end", () => {
			killProcess("end");
		});

		enc.stdout.once("error", () => {
			enc.stdout.emit("end");
		});

		enc.once("exit", (code, signal) => {
			if (code) {
				reject(new Error("FFMPEG: " + ffmpegErrors));
			}
		});

		this.volume.once("readable", () => {
			var data = {
				proc: enc,
				stream: this.volume,
				channels: 2
			};

			if (stream) {
				data.instream = stream;
			}

			resolve(data);
		});

		this.volume.once("end", () => {
			killProcess("end");
		});

		this.volume.once("error", () => {
			killProcess("end");
		});

		this.volume.on("end", () => {
			killProcess("end");
		});

		this.volume.on("close", () => {
			killProcess("close");
		});
	}
}
exports.default = AudioEncoder;
//# sourceMappingURL=AudioEncoder.js.map
