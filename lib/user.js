exports.User = function(username, id, discriminator, avatar){

    if(!id){ //there's no second argument
        var user = username;
        username = user.username;
        id = user.id;
        discriminator = user.discriminator;
        avatar = user.avatar;
    }

    this.username = username;
    this.discriminator = discriminator;
    this.id = id;
    this.avatar = avatar;
}

exports.User.prototype.getAvatarURL = function(){
    if(!this.avatar)
        return false;
    return "https://discordapp.com/api/users/" + this.id + "/avatars/" + this.avatar + ".jpg";
}

exports.User.prototype.mention = function(){
    return "<@"+this.id+">";
}

exports.User.prototype.equals = function(otherUser){

    return otherUser.id === this.id;

}
