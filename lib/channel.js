exports.Channel = function(name, server, type, id, isPrivate){

    if(!type){ //there's no second argument
        var channel = name;
        name = channel.name;
        server = server;
        type = channel.type;
        id = channel.id;
        isPrivate = channel.is_private;
    }

    this.name = name;
    this.server = server;
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
