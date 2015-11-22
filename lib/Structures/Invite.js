"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = require("./Server.js");
var ServerChannel = require("./ServerChannel.js");

var Invite = (function () {
    function Invite(data, chan, client) {
        _classCallCheck(this, Invite);

        this.maxAge = data.max_age;
        this.code = data.code;
        this.server = chan.server;
        this.channel = chan;
        this.revoked = data.revoked;
        this.createdAt = Date.parse(data.created_at);
        this.temporary = data.temporary;
        this.uses = data.uses;
        this.maxUses = data.uses;
        this.inviter = client.internal.users.get("id", data.inviter.id);
        this.xkcd = data.xkcdpass;
    }

    _createClass(Invite, [{
        key: "toString",
        value: function toString() {
            return "https://discord.gg/" + this.code;
        }
    }]);

    return Invite;
})();

module.exports = Invite;