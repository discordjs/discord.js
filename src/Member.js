var User = require("./user.js");
var ServerPermissions = require("./ServerPermissions.js");
var EvaluatedPermissions = require("./EvaluatedPermissions.js");

class Member extends User{
	
	constructor(user, server, roles){
		super(user); // should work, we are basically creating a Member that has the same properties as user and a few more
		this.serverID = server.id;
		this.client = server.client;
		this.rawRoles = roles;
	}
	
	get server(){
		return this.client.getServer("id", this.serverID);
	}
	
	get roles(){
		
		var ufRoles = [ this.server.getRole("id", this.server.id) ];
	
		for(var rawRole of this.rawRoles){
			ufRoles.push( this.server.getRole("id", rawRole) );
		}
		
		return ufRoles;
		
	}
	
	get evalPerms(){
		var basePerms = this.roles, //cache roles as it can be slightly expensive
			basePerm = basePerms[0].packed;
		
		
		basePerms = basePerms || [];
		for(var perm of basePerms){
			basePerm = basePerm | perm.packed;
		}
		
		return new EvaluatedPermissions(basePerm);
	}
	
	removeRole(role){
		this.rawRoles.splice(this.rawRoles.indexOf(role.id), 1);
	}
	
	addRole(role){
		if(this.rawRoles.indexOf(role.id) == -1){
			this.rawRoles.push(role.id);
		}
	}
	
	hasRole(role){
		for(var _role of this.roles){
			if(role.id === _role.id)
				return true;
		}
		return false;
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
		
		
		if(affectingOverwrites.length === 0 && affectingMemberOverwrites.length === 0){
			return this.evalPerms;
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