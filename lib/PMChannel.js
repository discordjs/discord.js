"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PMChannel = (function () {
	function PMChannel(data, client) {
		_classCallCheck(this, PMChannel);

		this.user = client.getUser("id", data.recipient.id);
		this.id = data.id;
		this.messages = [];
		this.client = client;
	}

	_createClass(PMChannel, [{
		key: "addMessage",
		value: function addMessage(data) {
			if (!this.getMessage("id", data.id)) {
				this.messages.push(data);
			}
			return this.getMessage("id", data.id);
		}
	}, {
		key: "getMessage",
		value: function getMessage(key, value) {

			if (this.messages.length > 1000) {
				this.messages.splice(0, 1);
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var message = _step.value;

					if (message[key] === value) {
						return message;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		}
	}, {
		key: "isPrivate",
		get: function get() {
			return true;
		}
	}]);

	return PMChannel;
})();

module.exports = PMChannel;