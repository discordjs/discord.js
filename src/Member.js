var User = require("./user.js");

class Member extends User{
	
	constructor(user, server){
		super(user); // should work, we are basically creating a Member that has the same properties as user and a few more
		this.server = server;
	}
	
	get roles(){
		return [];
	}
	
}

module.exports = Member;