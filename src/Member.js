var User = require("./user.js");
var ServerPermissions = require("./ServerPermissions.js");

class Member extends User{
	
	constructor(user, server, roles){
		super(user); // should work, we are basically creating a Member that has the same properties as user and a few more
		this.server = server;
		this.rawRoles = roles;
	}
	
	get roles(){
		
		var ufRoles = [ this.server.getRole(this.server.id) ];
		
		console.log(this.rawRoles);
		for(var rawRole of this.rawRoles){
			ufRoles.push( this.server.getRole(rawRole) );
		}
		
		return ufRoles;
		
	}
	
	get evalPerms(){
		
		var basePerms = this.roles, //cache roles as it can be slightly expensive
			basePerm = basePerms[0].packed;
			
		for(var perm of basePerms){
			basePerm = basePerm | perm.packed;
		}
		
		return new ServerPermissions({
			permissions : basePerm
		});
		
	}
	
}

module.exports = Member;