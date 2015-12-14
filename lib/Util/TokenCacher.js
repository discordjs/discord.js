"use strict";
/* global process */

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var savePaths = [process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preference' : '/var/local'), process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']];

var algo = "aes-256-ctr";

var TokenCacher = (function (_EventEmitter) {
	_inherits(TokenCacher, _EventEmitter);

	function TokenCacher(client, options) {
		_classCallCheck(this, TokenCacher);

		_EventEmitter.call(this);
		this.client = client;
		this.savePath = null;
		this.error = false;
		this.done = false;
		this.data = {};
	}

	TokenCacher.prototype.setToken = function setToken(email, password, token) {
		console.log("wanting to cache", token);
		var cipher = _crypto2["default"].createCipher(algo, password);
		var crypted = cipher.update("valid" + token, 'utf8', 'hex');
		crypted += cipher.final('hex');
		this.data[email] = crypted;
		this.save();
	};

	TokenCacher.prototype.save = function save() {
		_fsExtra2["default"].writeJson(this.savePath, this.data);
	};

	TokenCacher.prototype.getToken = function getToken(email, password) {

		if (this.data[email]) {

			try {
				var decipher = _crypto2["default"].createDecipher(algo, password);
				var dec = decipher.update(this.data[email], "hex", 'utf8');
				dec += decipher.final('utf8');
				return dec.indexOf("valid") === 0 ? dec.substr(5) : false;
			} catch (e) {
				console.log(e);
				return null;
			}
		} else {
			return null;
		}
	};

	TokenCacher.prototype.init = function init(ind) {
		var _this = this;

		var self = this;
		var savePath = savePaths[ind];

		_fsExtra2["default"].ensureDir(savePath, function (err) {

			if (err) {
				error(err);
			} else {
				//good to go

				_fsExtra2["default"].ensureFile(savePath + "/.discordjs/tokens.json", function (err) {
					if (err) {
						error(err);
					} else {
						//file exists

						_fsExtra2["default"].readFile(savePath + "/.discordjs/tokens.json", function (err, data) {

							if (err) {
								error(err);
							} else {
								// can read file, is it valid JSON?
								try {

									_this.data = JSON.parse(data);
									// good to go!
									_this.savePath = savePath + "/.discordjs/tokens.json";
									_this.emit("ready");
									_this.done = true;
								} catch (e) {
									// not valid JSON, make it valid and then write
									_fsExtra2["default"].writeJson(savePath + "/.discordjs/tokens.json", {}, function (err) {
										if (err) {
											error(err);
										} else {
											// good to go!
											_this.savePath = savePath + "/.discordjs/tokens.json";
											_this.emit("ready");
											_this.done = true;
										}
									});
								}
							}
						});
					}
				});
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
	};

	return TokenCacher;
})(_events2["default"]);

exports["default"] = TokenCacher;
module.exports = exports["default"];
