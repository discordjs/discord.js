"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InternalClient = require("./InternalClient.js");
var EventEmitter = require("events");

var Client = (function (_EventEmitter) {
	_inherits(Client, _EventEmitter);

	/*
 	this class is an interface for the internal
 	client.
 */

	function Client(options) {
		_classCallCheck(this, Client);

		_EventEmitter.call(this);
		this.options = options || {};
		this.internal = new InternalClient(this);
	}

	// def login

	Client.prototype.login = function login(email, password) {
		var cb = arguments.length <= 2 || arguments[2] === undefined ? function (err, token) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.login(email, password).then(function (token) {
				cb(null, token);
				resolve(token);
			})["catch"](function (e) {
				cb(e);
				reject(e);
			});
		});
	};

	// def logout

	Client.prototype.logout = function logout() {
		var cb = arguments.length <= 0 || arguments[0] === undefined ? function (err) {} : arguments[0];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.logout().then(function () {
				cb();
				resolve();
			})["catch"](function (e) {
				cb(e);
				reject(e);
			});
		});
	};

	// def sendMessage

	Client.prototype.sendMessage = function sendMessage(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (e, m) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {

			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			self.internal.sendMessage(where, content, options).then(function (m) {
				callback(null, m);
				resolve(m);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def sendTTSMessage

	Client.prototype.sendTTSMessage = function sendTTSMessage(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (e, m) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			self.sendMessage(where, content, { tts: true }).then(function (m) {
				callback(null, m);
				resolve(m);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def reply

	Client.prototype.reply = function reply(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (e, m) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {

			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			var msg = self.internal.resolver.resolveMessage(where);
			if (msg) {
				content = msg.author + ", " + content;
				self.internal.sendMessage(msg, content, options).then(function (m) {
					callback(null, m);
					resolve(m);
				})["catch"](function (e) {
					callback(e);
					reject(e);
				});
			} else {
				var err = new Error("Destination not resolvable to a message!");
				callback(err);
				reject(err);
			}
		});
	};

	// def replyTTS

	Client.prototype.replyTTS = function replyTTS(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

		return new Promise(function (resolve, reject) {
			self.reply(where, content, { tts: true }).then(function (m) {
				callback(null, m);
				resolve(m);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	Client.prototype.deleteMessage = function deleteMessage(msg) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (e) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			self.internal.deleteMessage(msg).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	return Client;
})(EventEmitter);

module.exports = Client;