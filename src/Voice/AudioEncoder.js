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
				console.log("end");
				reject("end");
			});

			enc.stdout.on("close", function () {
				console.log("close");
				reject("close");
			});
		});
	}
}
