var User = require("./user.js");

class Member extends User{
	
	constructor(user, server, roles){
		super(user); // should work, we are basically creating a Member that has the same properties as user and a few more
		this.server = server;
		this.rawRoles = roles;
	}
	
	get roles(){
		
		var ufRoles = [];
		
		for(var rawRole of this.rawRoles){
			ufRoles.push( this.server.getRole(rawRole) );
		}
		
		return ufRoles;
		
	}
	
}

module.exports = Member;