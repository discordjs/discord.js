"use strict";

import cpoc from "child_process";

var opus;
try {
	opus = require("node-opus");
} catch (e) {
	// no opus!
}

import VolumeTransformer from "./VolumeTransformer";

export default class AudioEncoder {
	constructor() {
		if (opus) {
			this.opus = new opus.OpusEncoder(48000, 2);
		}
		this.choice = false;
		this.sanityCheckPassed = undefined;
	}

	sanityCheck() {
		var _opus = this.opus;
		var encodeZeroes = function() {
			try {
				var zeroes = new Buffer(1920);
				zeroes.fill(0);
				return _opus.encode(zeroes, 1920).readUIntBE(0, 3);
			} catch(err) {
				return false;
			}
		};
		if(this.sanityCheckPassed === undefined) this.sanityCheckPassed = (encodeZeroes() === 16056318);
		return this.sanityCheckPassed;
	}

	opusBuffer(buffer) {

		return this.opus.encode(buffer, 1920);

	}

	getCommand(force) {
		if(this.choice && force)
			return choice;

		var choices = ["avconv", "ffmpeg"];

		for (var choice of choices) {
			var p = cpoc.spawnSync(choice);
			if (!p.error) {
				this.choice = choice;
				return choice;
			}
		}

		return "help";
	}

	encodeStream(stream, options) {
		return new Promise((resolve, reject) => {
			this.volume = new VolumeTransformer(options.volume);

			var enc = cpoc.spawn(this.getCommand(), [
				'-i', '-',
				'-f', 's16le',
				'-ar', '48000',
				'-ss', (options.seek || 0),
				'-ac', 2,
				'pipe:1'
			]);

			stream.pipe(enc.stdin);

			this.hookEncodingProcess(resolve, reject, enc, stream);
		});
	}

	encodeFile(file, options) {
		return new Promise((resolve, reject) => {
			this.volume = new VolumeTransformer(options.volume);

			var enc = cpoc.spawn(this.getCommand(), [
				'-i', file,
				'-f', 's16le',
				'-ar', '48000',
				'-ss', (options.seek || 0),
				'-ac', 2,
				'pipe:1'
			]);

			this.hookEncodingProcess(resolve, reject, enc);
		});
	}

	encodeArbitraryFFmpeg(ffmpegOptions, volume) {
		return new Promise((resolve, reject) => {
			this.volume = new VolumeTransformer(volume);

			// add options discord.js needs
			var options = ffmpegOptions.concat([
				'-f', 's16le',
				'-ar', '48000',
				'-ac', 2,
				'pipe:1'
			]);
			var enc = cpoc.spawn(this.getCommand(), options);

			this.hookEncodingProcess(resolve, reject, enc);
		});
	}

	hookEncodingProcess(resolve, reject, enc, stream) {
		var processKilled = false;

		function killProcess(cause) {
			if (processKilled)
				return;

			enc.stdin.pause();
			enc.kill("SIGKILL");

			processKilled = true;

			reject(cause);
		}

		var ffmpegErrors = "";

		enc.stdout.pipe(this.volume);

		enc.stderr.on("data", (data) => {
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
		})

		this.volume.on("end", () => {
			killProcess("end");
		});

		this.volume.on("close", () => {
			killProcess("close");
		});
	}
}
