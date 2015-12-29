"use strict";

import cpoc from "child_process";

var opus;
try {
	opus = require("node-opus");
} catch (e) {
	// no opus!
}

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

		if (this.choice && force)
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
		var self = this;
		return new Promise((resolve, reject) => {
			var enc = cpoc.spawn(self.getCommand(), [
				'-loglevel', '0',
				'-i', '-',
				'-f', 's16le',
				'-ar', '48000',
				'-ac', 2,
				'pipe:1',
				'-af', 'volume=' + (options.volume || 1)
			], {stdio: ['pipe', 'pipe', 'ignore']});

			stream.pipe(enc.stdin);

			enc.stdout.once("readable", function () {
				resolve({
					proc: enc,
					stream: enc.stdout,
					instream: stream,
					channels : 2
				});
			});

			enc.stdout.on("end", function () {
				reject("end");
			});

			enc.stdout.on("close", function () {
				reject("close");
			});
		});
	}

	encodeFile(file, options) {
		var self = this;
		return new Promise((resolve, reject) => {
			var enc = cpoc.spawn(self.getCommand(), [
				'-loglevel', '0',
				'-i', file,
				'-f', 's16le',
				'-ar', '48000',
				'-ac', 2,
				'pipe:1',
				'-af', '"volume=' + (options.volume || 1)+'"'
			], { stdio: ['pipe', 'pipe', 'ignore'] });

			enc.stdout.once("readable", function () {
				resolve({
					proc: enc,
					stream: enc.stdout,
					channels : 2
				});
			});

			enc.stdout.on("end", function () {
				reject("end");
			});

			enc.stdout.on("close", function () {
				reject("close");
			});
		});
	}

	encodeArbitraryFFmpeg(ffmpegOptions) {
		var self = this;
		return new Promise((resolve, reject) => {
			// add options discord.js needs
			var options = ffmpegOptions.concat([
				'-loglevel', '0',
				'-f', 's16le',
				'-ar', '48000',
				'-ac', 2,
				'pipe:1'
			]);
			var enc = cpoc.spawn(self.getCommand(), options, { stdio: ['pipe', 'pipe', 'ignore'] });

			enc.stdout.once("readable", function () {
				resolve({
					proc: enc,
					stream: enc.stdout,
					channels : 2
				});
			});

			enc.stdout.on("end", function () {
				reject("end");
			});

			enc.stdout.on("close", function () {
				reject("close");
			});
		});
	}
}
