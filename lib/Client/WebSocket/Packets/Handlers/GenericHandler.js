"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GenericHandler = function () {
	function GenericHandler(packetManager) {
		(0, _classCallCheck3.default)(this, GenericHandler);

		this.manager = packetManager;
		this.client = this.manager.client;
	}

	(0, _createClass3.default)(GenericHandler, [{
		key: "handle",
		value: function handle(packet) {
			return false;
		}
	}]);
	return GenericHandler;
}();

module.exports = GenericHandler;
