"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

class Webhook {
  constructor(data, server, channel, user) {
    this.server = server;
    this.channel = channel;
    this.id = data.id;
    this.user = user || data.user;
    this.name = data.name;
    this.avatar = data.avatar;
    this.token = data.token;
  }

  get getURL() {
    return `https://canary.discordapp.com/api/webhooks/${ this.channel.id }/${ this.token.id }`;
  }

  toObject() {
    let keys = ['id', 'name', 'avatar', 'token'],
        obj = {};

    for (let k of keys) {
      obj[k] = this[k];
    }

    return obj;
  }
}
exports.default = Webhook;
//# sourceMappingURL=Webhook.js.map
