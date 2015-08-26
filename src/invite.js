class Invite {
    constructor(data, client) {
        this.max_age = data.max_age;
        this.code = data.code;
        this.server = client.getServer("id", data.guild.id);
        this.revoked = data.revoked;
        this.created_at = Date.parse(data.created_at);
        this.temporary = data.temporary;
        this.uses = data.uses;
        this.max_uses = data.uses;
        this.inviter = client.addUser(data.inviter);
        this.xkcd = data.xkcdpass;
        this.channel = client.getChannel("id", data.channel.id);
    }

    get URL() {
        var code = (this.xkcd ? this.xkcdpass : this.code);
        return "https://discord.gg/" + code;
    }
}

module.exports = Invite;