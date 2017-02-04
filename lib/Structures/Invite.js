"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Invite {
    constructor(data, chan, client) {
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

    toString() {
        return `https://discord.gg/${ this.code }`;
    }

    delete() {
        return this.client.deleteInvite.apply(this.client, reg(this, arguments));
    }

    join() {
        return this.client.joinServer.apply(this.client, reg(this, arguments));
    }
}
exports.default = Invite;
//# sourceMappingURL=Invite.js.map
