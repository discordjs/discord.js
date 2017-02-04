"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require("../Constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* example data
{
  id: '164585980739846145'
  name: 'wlfSS',
  roles: [ '135829612780322816' ],
  require_colons: false,
  managed: true,
}
*/

var Webhook = function () {
  function Webhook(data, server, channel, user) {
    _classCallCheck(this, Webhook);

    this.server = server;
    this.channel = channel;
    this.id = data.id;
    this.user = user || data.user;
    this.name = data.name;
    this.avatar = data.avatar;
    this.token = data.token;
  }

  _createClass(Webhook, [{
    key: "toObject",
    value: function toObject() {
      var keys = ['id', 'name', 'avatar', 'token'],
          obj = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var k = _step.value;

          obj[k] = this[k];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return obj;
    }
  }, {
    key: "getURL",
    get: function get() {
      return "https://canary.discordapp.com/api/webhooks/" + this.channel.id + "/" + this.token.id;
    }
  }]);

  return Webhook;
}();

exports.default = Webhook;
//# sourceMappingURL=Webhook.js.map
