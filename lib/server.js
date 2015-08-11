var User = require("./user.js").User;
var List = require("./list.js").List;

exports.Server = function(region, ownerID, name, id, members){

    this.region = region;
    this.ownerID = ownerID;
    this.name = name;
    this.id = id;
    this.members = new List("id");
    this.channels = new List("id");

    for(x in members){
        var member = members[x].user;
        this.members.add( new User(member) );
    }

}

exports.Server.prototype.getDefaultChannel = function(){

    return this.channels.filter("name", "general", true);

}
