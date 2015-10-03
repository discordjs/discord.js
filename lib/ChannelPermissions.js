"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChannelPermissions = (function () {
	function ChannelPermissions(data) {
		_classCallCheck(this, ChannelPermissions);

		function getBit(x) {
			return (this.packed >>> x & 1) === 1;
		}

		this.type = data.type; //either member or role

		this.id = data.id;

		this.deny = data.deny;

		this.allow = data.allow;
	}

	_createClass(ChannelPermissions, [{
		key: "getBit",
		value: function getBit(x) {
			return (this.packed >>> x & 1) === 1;
		}
	}]);

	return ChannelPermissions;
})();

module.exports = ChannelPermissions;