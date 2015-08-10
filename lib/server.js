var User = require("./user.js").User;

exports.Server = function(region, ownerID, name, id, members){

    this.region = region;
    this.ownerID = ownerID;
    this.name = name;
    this.id = id;
    this.members = [];
    for(x in members){
        var _member = members[x].user;
        this.members.push( new User(_member.username, _member.id, _member.discriminator, _member.avatar) );
    }

}
