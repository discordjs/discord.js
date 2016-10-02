"use strict";exports.__esModule = true;var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var _Constants=require("../Constants"); /* example data
{
  id: '164585980739846145'
  name: 'wlfSS',
  roles: [ '135829612780322816' ],
  require_colons: false,
  managed: true,
}
*/var Webhook=(function(){function Webhook(data,server,channel,user){_classCallCheck(this,Webhook);this.server = server;this.channel = channel;this.id = data.id;this.user = user || data.user;this.name = data.name;this.avatar = data.avatar;this.token = data.token;}Webhook.prototype.toObject = function toObject(){var keys=['id','name','avatar','token'],obj={};for(var _iterator=keys,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;) {var _ref;if(_isArray){if(_i >= _iterator.length)break;_ref = _iterator[_i++];}else {_i = _iterator.next();if(_i.done)break;_ref = _i.value;}var k=_ref;obj[k] = this[k];}return obj;};_createClass(Webhook,[{key:"getURL",get:function get(){return "https://canary.discordapp.com/api/webhooks/" + this.channel.id + "/" + this.token.id;}}]);return Webhook;})();exports["default"] = Webhook;module.exports = exports["default"];
