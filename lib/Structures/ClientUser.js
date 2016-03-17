'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = require('./User');

var ClientUser = function (_User) {
	(0, _inherits3.default)(ClientUser, _User);

	function ClientUser(client, data) {
		(0, _classCallCheck3.default)(this, ClientUser);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientUser).call(this, client, data));

		if (data) {
			_this.setup(data);
		}
		return _this;
	}

	(0, _createClass3.default)(ClientUser, [{
		key: 'setup',
		value: function setup(data) {
			(0, _get3.default)((0, _getPrototypeOf2.default)(ClientUser.prototype), 'setup', this).call(this, data);
			this.verified = data.verified || this.verified;
			this.email = data.email || this.email;
		}
	}]);
	return ClientUser;
}(User);

module.exports = ClientUser;
