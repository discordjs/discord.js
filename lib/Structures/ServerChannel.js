"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Channel = require("./Channel.js");
var Cache = require("../Util/Cache.js");
var PermissionOverwrite = require("./PermissionOverwrite.js");

var ServerChannel = (function (_Channel) {
	_inherits(ServerChannel, _Channel);

	function ServerChannel(data, client) {
		var _this = this;

		_classCallCheck(this, ServerChannel);

		_Channel.call(this, data, client);
		this.type = data.type;
		this.permissionOverwrites = new Cache();
		data.permission_overwrites.forEach(function (permission) {
			_this.permissionOverwrites.add(new PermissionOverwrite(permission));
		});
	}

	return ServerChannel;
})(Channel);

module.exports = ServerChannel;