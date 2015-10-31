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

	/*
 	def login
 */

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

	/*
 
 */

	return Client;
})(EventEmitter);

module.exports = Client;