"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Invite = function () {
    function Invite(data, chan, client) {
        _classCallCheck(this, Invite);

        this.maxAge = data.max_age;
        this.code = data.code;
        if (chan) {
            this.channel = chan;
            this.server = chan.server;
        } else {
            this.channel = data.channel;
            this.server = data.guild;
        }
        this.revoked = data.revoked;
        this.createdAt = Date.parse(data.created_at);
        this.temporary = data.temporary;
        this.uses = data.uses;
        this.maxUses = data.max_uses;
        if (data.inviter) {
            this.inviter = client.internal.users.get("id", data.inviter.id);
        }
        this.xkcd = data.xkcdpass;
    }

    _createClass(Invite, [{
        key: "toString",
        value: function toString() {
            return "https://discord.gg/" + this.code;
        }
    }, {
        key: "delete",
        value: function _delete() {
            return this.client.deleteInvite.apply(this.client, reg(this, arguments));
        }
    }, {
        key: "join",
        value: function join() {
            return this.client.joinServer.apply(this.client, reg(this, arguments));
        }
    }]);

    return Invite;
}();

exports.default = Invite;
//# sourceMappingURL=Invite.js.map
