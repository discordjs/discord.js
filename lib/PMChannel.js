var User = require("./user.js").User;

exports.PMChannel = function(user, id){
    this.user = new User(user);
    this.id = id;
}
