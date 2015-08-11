var User = require("./user.js").User;

exports.Message = function(time, author, content, channel, id, mentions){

    if(!content){
        message = time;
        channel = author;
        time = message.timestamp;
        author = message.author;
        content = message.content;
        id = message.id;
        mentions = message.mentions;
    }

    this.time = Date.parse(time);
    this.author = new User(author);
    this.content = content.replace(/<[^>]*>/g, "").replace(/\s+/g, ' ').trim();
    this.channel = channel;
    this.id = id;
    this.mentions = mentions || [];
    for(x in mentions){
        var _mention = mentions[x];
        this.mentions.push( new User(_mention.username, _mention.id, _mention.discriminator, _mention.avatar) );
    }
}

exports.Message.prototype.isMentioned = function(user){

    for(mention of this.mentions){
        if(user.equals(mention)){
            return true;
        }
    }

    return false;

}
