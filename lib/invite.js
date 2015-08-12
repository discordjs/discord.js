var User = require("./user.js").User;

exports.Invite = function(json){

    this.max_age = json.max_age;
    this.code = json.code;
    this.server = json.guild;
    this.revoked = json.revoked;
    this.created_at = Date.parse(json.created_at);
    this.temporary = json.temporary;
    this.uses = json.uses;
    this.max_uses = json.uses;
    this.inviter = new User(json.inviter);
    this.xkcdpass = json.xkcdpass;
    this.channel = json.channel;
}

exports.Invite.prototype.generateInviteURL = function(xkcd){
    var code = (xkcd ? this.xkcdpass : this.code);
    return "https://discord.gg/"+code;
}
