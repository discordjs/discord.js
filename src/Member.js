var User = require("./user.js");
var ServerPermissions = require("./ServerPermissions.js");
var EvaluatedPermissions = require("./EvaluatedPermissions.js");

class Member extends User{
	
	constructor(user, server, roles){
		super(user); // should work, we are basically creating a Member that has the same properties as user and a few more
		this.server = server;
		this.rawRoles = roles;
	}
	
	get roles(){
		
		var ufRoles = [ this.server.getRole(this.server.id) ];
	
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
	
	permissionsIn(channel){
		
		if(channel.server.ownerID === this.id){
			return new EvaluatedPermissions(4294967295); //all perms
		}
		
		var affectingOverwrites = [];
		var affectingMemberOverwrites = [];
		
		for(var overwrite of channel.roles){
			if(overwrite.id === this.id && overwrite.type === "member"){
				affectingMemberOverwrites.push(overwrite);
			}else if( this.rawRoles.indexOf(overwrite.id) !== -1 ){
				affectingOverwrites.push(overwrite);
			}
		}
		
		for(var perm of affectingOverwrites){
			console.log("hey", perm.attachFiles);
		}
		
		if(affectingOverwrites.length === 0 && affectingMemberOverwrites.length === 0){
			return new EvaluatedPermissions(this.evalPerms.packed);
		}
		
		var finalPacked = (affectingOverwrites.length !== 0 ? affectingOverwrites[0].packed : affectingMemberOverwrites[0].packed);
		
		for(var overwrite of affectingOverwrites){
			finalPacked = finalPacked & ~overwrite.deny;
			finalPacked = finalPacked | overwrite.allow;
		}
		
		for(var overwrite of affectingMemberOverwrites){
			finalPacked = finalPacked & ~overwrite.deny;
			finalPacked = finalPacked | overwrite.allow;
		}
		
		return new EvaluatedPermissions(finalPacked);
		
	}
	
}

module.exports = Member;