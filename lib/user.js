exports.User = function(username, id, discriminator, avatar){
    this.username = username;
    this.discriminator = discriminator;
    this.id = id;
    this.avatar = avatar;
}

exports.User.prototype.mention = function(){
    return "<@"+this.id+">";
}

exports.User.prototype.equals = function(otherUser){

    if(otherUser.id === this.id){
        return true;
    } else {
        return false;
    }

}
