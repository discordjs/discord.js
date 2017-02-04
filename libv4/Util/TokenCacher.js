"use strict";
/* global process */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var savePaths = [process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "Library/Preferences" : "/var/local"), process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"], process.cwd(), "/tmp"];

var algo = "aes-256-ctr";

function secureEmail(email, password) {
	return new Buffer(_crypto2.default.createHash("sha256").update(email + password, "utf8").digest()).toString("hex");
}

function exists(path) {
	// Node deprecated the `fs.exists` method apparently...
	try {
		_fs2.default.accessSync(path);
		return true;
	} catch (e) {
		return false;
	}
}

var TokenCacher = function (_EventEmitter) {
	_inherits(TokenCacher, _EventEmitter);

	function TokenCacher(client, options) {
		_classCallCheck(this, TokenCacher);

		var _this = _possibleConstructorReturn(this, (TokenCacher.__proto__ || Object.getPrototypeOf(TokenCacher)).call(this));

		_this.client = client;
		_this.savePath = null;
		_this.error = false;
		_this.done = false;
		_this.data = {};
		return _this;
	}

	_createClass(TokenCacher, [{
		key: "setToken",
		value: function setToken() {
			var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
			var token = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

			email = secureEmail(email, password);
			var cipher = _crypto2.default.createCipher(algo, password);
			var crypted = cipher.update("valid" + token, "utf8", "hex");
			crypted += cipher.final("hex");
			this.data[email] = crypted;
			this.save();
		}
	}, {
		key: "save",
		value: function save() {
			_fs2.default.writeFile(this.savePath, JSON.stringify(this.data));
		}
	}, {
		key: "getToken",
		value: function getToken() {
			var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";


			email = secureEmail(email, password);

			if (this.data[email]) {

				try {
					var decipher = _crypto2.default.createDecipher(algo, password);
					var dec = decipher.update(this.data[email], "hex", "utf8");
					dec += decipher.final("utf8");
					return dec.indexOf("valid") === 0 ? dec.substr(5) : false;
				} catch (e) {
					// not a valid token
					return null;
				}
			} else {
				return null;
			}
		}
	}, {
		key: "init",
		value: function init(ind) {
			var _this2 = this;

			var self = this;
			var savePath = savePaths[ind];

			// Use one async function at the beginning, so the entire function is async,
			// then later use only sync functions to increase readability
			_fs2.default.stat(savePath, function (err, dirStats) {
				// Directory does not exist.
				if (err) error(err);else {
					try {
						var storeDirPath = savePath + "/.discordjs";
						var filePath = storeDirPath + "/tokens.json";

						if (!exists(storeDirPath)) {
							// First, make sure the directory exists, otherwise the next
							// call will fail.
							_fs2.default.mkdirSync(storeDirPath);
						}
						if (!exists(filePath)) {
							// This will create an empty file if the file doesn't exist, and error
							// if it does exist. We previously checked that it doesn't exist so we
							// can do this safely.
							_fs2.default.closeSync(_fs2.default.openSync(filePath, 'wx'));
						}

						var data = _fs2.default.readFileSync(filePath);
						try {
							_this2.data = JSON.parse(data);
							_this2.savePath = filePath;
							_this2.emit('ready');
							_this2.done = true;
						} catch (e) {
							// not valid JSON, make it valid and then write
							_fs2.default.writeFileSync(filePath, '{}');
							_this2.savePath = filePath;
							_this2.emit("ready");
							_this2.done = true;
						}
					} catch (e) {
						error(e);
					}
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
	}]);

	return TokenCacher;
}(_events2.default);

exports.default = TokenCacher;
//# sourceMappingURL=TokenCacher.js.map
