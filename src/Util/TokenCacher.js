"use strict";
/* global process */

import fs from "fs-extra";
import EventEmitter from "events";
import crypto from "crypto";

var savePaths = [
	process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preference' : '/var/local'),
	process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
];

var algo = "aes-256-ctr";

export default class TokenCacher extends EventEmitter {

	constructor(client, options) {
		super();
		this.client = client;
		this.savePath = null;
		this.error = false;
		this.done = false;
		this.data = {};
	}

	setToken(email, password, token) {
		console.log("wanting to cache", token);
		token = new Buffer(token).toString("base64");
		var cipher = crypto.createCipher(algo,password)
		var crypted = cipher.update(token,'utf8','base64')
		crypted += cipher.final('base64');
		this.data[email] = crypted;
		this.save();
	}

	save() {
		fs.writeJson(this.savePath, this.data);
	}

	getToken(email, password){

		if (this.data[email]) {

			try {
				var decipher = crypto.createDecipher(algo, password)
				var dec = decipher.update(this.data[email], "base64", 'utf8')
				dec += decipher.final('utf8');
				return new Buffer(dec, "base64").toString("ascii");
			} catch (e) {
				return null;
			}

		} else {
			return null;
		}

	}

	init(ind) {

		var self = this;
		var savePath = savePaths[ind];

		fs.ensureDir(savePath, err => {

			if (err) {
				error(err);
			} else {
				//good to go

				fs.ensureFile(savePath + "/.discordjs/tokens.json", err => {
					if (err) {
						error(err);
					} else {
						//file exists

						fs.readFile(savePath + "/.discordjs/tokens.json", (err, data) => {

							if (err) {
								error(err);
							} else {
								// can read file, is it valid JSON?
								try {

									this.data = JSON.parse(data);
									// good to go!
									this.savePath = savePath + "/.discordjs/tokens.json";
									this.emit("ready");
									this.done = true;

								} catch (e) {
									// not valid JSON, make it valid and then write
									fs.writeJson(savePath + "/.discordjs/tokens.json", {}, err => {
										if (err) {
											error(err);
										} else {
											// good to go!
											this.savePath = savePath + "/.discordjs/tokens.json";
											this.emit("ready");
											this.done = true;
										}
									});
								}
							}

						});

					}
				})

			}

		});

		function error(e) {
			ind++;
			if (!savePaths[ind]) {
				self.emit("error");
				self.error = e;
				self.done = true;
			} else {
				self.init(ind);
			}
		}

	}
}