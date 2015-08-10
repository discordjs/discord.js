exports.Channel = function(name, serverId, type, id, isPrivate){

    this.name = name;
    this.serverId = serverId;
    this.type = type;
    this.id = id;
    this.isPrivate = isPrivate;

}

exports.Channel.equals = function(otherChannel){

    if(otherChannel.id === this.id){
        return true;
    } else {
        return false;
    }

}
