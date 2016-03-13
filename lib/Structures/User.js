"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require("../util/Constants");
var DataStore = require("../util/DataStore");

var User = function User(client, data) {
	(0, _classCallCheck3.default)(this, User);

	this.client = client;
	this.username = data.username;
	this.id = data.id;
	this.discriminator = data.discriminator;
	this.avatar = data.avatar;
};

module.exports = User;