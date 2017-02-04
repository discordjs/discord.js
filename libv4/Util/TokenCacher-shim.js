"use strict";

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Shim for the token cacher in the browser.
var TokenCacher = function () {
			function TokenCacher() {
						_classCallCheck(this, TokenCacher);
			}

			_createClass(TokenCacher, [{
						key: "setToken",
						value: function setToken() {}
			}, {
						key: "save",
						value: function save() {}
			}, {
						key: "getToken",
						value: function getToken() {
									return null;
						}
			}, {
						key: "init",
						value: function init(ind) {
									this.done = true;
						}
			}]);

			return TokenCacher;
}();

exports.default = TokenCacher;
//# sourceMappingURL=TokenCacher-shim.js.map
