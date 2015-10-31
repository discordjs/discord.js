"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = require("./Channel.js");
var Equality = require("../Util/Equality.js");

var PMChannel = (function (_Equality) {
	_inherits(PMChannel, _Equality);

	function PMChannel(data, client) {
		_classCallCheck(this, PMChannel);

		_Equality.call(this);
		this.client = client;

		this.type = data.type || "text";
		this.id = data.id;
		this.lastMessageId = data.last_message_id;
		this.recipient = this.client.internal.users.add(data.recipient);
	}

	/* warning! may return null */

	_createClass(PMChannel, [{
		key: "lastMessage",
		get: function get() {
			return this.messages.get("id", this.lastMessageID);
		}
	}]);

	return PMChannel;
})(Equality);

module.exports = PMChannel;