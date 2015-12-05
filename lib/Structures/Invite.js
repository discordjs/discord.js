"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    Invite.prototype.toString = function toString() {
        return "https://discord.gg/" + this.code;
    };

    Invite.prototype["delete"] = function _delete() {
        return this.client.deleteInvite.apply(this.client, reg(this, arguments));
    };

    Invite.prototype.join = function join() {
        return this.client.joinServer.apply(this.client, reg(this, arguments));
    };

    return Invite;
})();

exports["default"] = Invite;
module.exports = exports["default"];
