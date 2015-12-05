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
			this.opus = new opus.OpusEncoder(48000, 1);
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

	encodeStream(stream, callback = function (err, buffer) { }) {
		var self = this;
		return new Promise((resolve, reject) => {
			var enc = cpoc.spawn(self.getCommand(), [
				'-i', "-",
				'-f', 's16le',
				'-ar', '48000',
				'-ac', 1,
				'pipe:1'
			]);

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

	encodeFile(file, callback = function (err, buffer) { }) {
		var self = this;
		return new Promise((resolve, reject) => {
			var enc = cpoc.spawn(self.getCommand(), [
				'-i', file,
				'-f', 's16le',
				'-ar', '48000',
				'-ac', 1,
				'pipe:1'
			]);

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
	}
}
