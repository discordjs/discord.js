"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var go = function () {
	var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						client.login(process.env["ds_email"], process.env["ds_password"]).then(function (token) {
							return client.logger.log(TAG, "connected with token " + token);
						}).catch(console.log);

					case 1:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));
	return function go() {
		return ref.apply(this, arguments);
	};
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Discord = require("../");
var client = new Discord.Client({
	logging: {
		enabled: true
	}
});
var TAG = "testscript";

go();