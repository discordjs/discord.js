"use strict";

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Constants = require("../Constants");

/* example data
{
  id: '164585980739846145'
  name: 'wlfSS',
  roles: [ '135829612780322816' ],
  require_colons: false,
  managed: true,
}
*/

var Emoji = (function () {
  function Emoji(data, server) {
    _classCallCheck(this, Emoji);

    this.server = server;
    this.id = data.id;
    this.name = data.name;
    this.roleList = data.roles;
    this.colons = data.require_colons;
    this.managed = data.managed;
  }

  _createClass(Emoji, [{
    key: "roles",
    get: function get() {
      var roleGroup = [];

      if (this.managed) {
        for (var i = 0; i < this.roleList.length; i++) {
          var roleID = this.roleList[i].toString();
          var role = this.server.roles.get("id", roleID);
          roleGroup.push(role);
        }
      }
      return roleGroup;
    }
  }, {
    key: "getURL",
    get: function get() {
      return _Constants.Endpoints.EMOJI(this.id);
    }
  }]);

  return Emoji;
})();

exports["default"] = Emoji;
module.exports = exports["default"];
