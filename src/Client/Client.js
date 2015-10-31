"use strict";

var InternalClient = require("./InternalClient.js");
var EventEmitter = require("events");

class Client extends EventEmitter {
	/*
		this class is an interface for the internal
		client.
	*/
	constructor(options) {
		super();
		this.options = options || {};
		this.internal = new InternalClient(this);
	}
	
	// def login
	login(email, password, cb = function (err, token) { }) {
		var self = this;
		return new Promise((resolve, reject) => {

			self.internal.login(email, password)
				.then((token) => {
					cb(null, token);
					resolve(token);
				})
				.catch((e) => {
					cb(e);
					reject(e);
				});

		});
	}
	
	// def logout
	logout(cb = function (err) { }) {
		var self = this;
		return new Promise((resolve, reject) => {

			self.internal.logout()
				.then(() => {
					cb();
					resolve();
				})
				.catch((e) => {
					cb(e);
					reject(e);
				})

		})
	}
	// def sendMessage
	sendMessage(where, content, options = {}, callback = function (e, m) { }) {
		var self = this;
		return new Promise((resolve, reject) => {

			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			self.internal.sendMessage(where, content, options)
				.then(m => {
					callback(null, m);
					resolve(m);
				}).catch(e => {
					callback(e);
					reject(e);
				});

		});
	}
	
	// def sendTTSMessage
	sendTTSMessage(where, content, callback = function (e, m) { }) {
		var self = this;
		return new Promise((resolve, reject) => {
			self.sendMessage(where, content, { tts: true })
				.then(m => {
					callback(null, m);
					resolve(m);
				}).catch(e => {
					callback(e);
					reject(e);
				});

		});
	}
	// def reply
	reply(where, content, options = {}, callback = function (e, m) { }) {
		var self = this;
		return new Promise((resolve, reject) => {

			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			var msg = self.internal.resolver.resolveMessage(where);
			if (msg) {
				content = msg.author + ", " + content;
				self.internal.sendMessage(msg, content, options)
					.then(m => {
						callback(null, m);
						resolve(m);
					}).catch(e => {
						callback(e);
						reject(e);
					});
			} else {
				var err = new Error("Destination not resolvable to a message!");
				callback(err);
				reject(err);
			}

		});
	}
	
	// def replyTTS
	replyTTS(where, content, callback = function () { }) {
		return new Promise((resolve, reject) => {
			self.reply(where, content, { tts: true })
				.then(m => {
					callback(null, m);
					resolve(m);
				}).catch(e => {
					callback(e);
					reject(e);
				});
		});
	}
	// def deleteMessage
	deleteMessage(msg, options = {}, callback = function (e) { }) {
		var self = this;
		return new Promise((resolve, reject) => {
			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			self.internal.deleteMessage(msg)
				.then(() => {
					callback();
					resolve();
				})
				.catch(e => {
					callback(e);
					reject(e);
				});

		});
	}
	//def updateMessage
	updateMessage(msg, content, options = {}, callback = function(err, msg){}) {
		var self = this;
		return new Promise((resolve, reject) => {
			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}
			
			self.internal.updateMessage(msg, content, options)
				.then(msg => {
					callback(null, msg);
					resolve(msg);
				})
				.catch(e => {
					callback(e);
					reject(e);
				});
			
		});
	}
	
	// def getChannelLogs
	getChannelLogs(where, limit=500, options={}, callback=function(err, logs){}){
		
		var self = this;
		return new Promise((resolve, reject) => {
			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}
			self.internal.getChannelLogs(where, limit, options)
				.then( logs => {
					callback(null, logs);
					resolve(logs);
				})
				.catch( e => {
					callback(e);
					reject(e);
				});
			
		});
		
	}
}

module.exports = Client;