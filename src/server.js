var ServerPermissions = require("./ServerPermissions.js");
var Member = require("./Member.js");

class Server {
	constructor(data, client) {
		this.client = client;
		this.region = data.region;
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.id = data.id;
		this.members = [];
		this.channels = [];
		this.icon = data.icon;
		this.afkTimeout = data.afk_timeout;
		this.afkChannelId = data.afk_channel_id;
		
		this.roles = [];
		
		for(var permissionGroup of data.roles){
			this.roles.push( new ServerPermissions(permissionGroup) );
		}

		if(!data.members){
			data.members = [ client.user ];
			return;
		}

		for (var member of data.members) {
			
			// first we cache the user in our Discord Client,
			// then we add it to our list. This way when we
			// get a user from this server's member list,
			// it will be identical (unless an async change occurred)
			// to the client's cache.
			if(member.user)
				this.addMember(client.addUser(member.user), member.roles);

		}
	}
	
	get permissionGroups(){
		return this.roles;
	}
	
	get permissions(){
		return this.roles;
	}

	get iconURL() {
		if (!this.icon)
			return null;
		return `https://discordapp.com/api/guilds/${this.id}/icons/${this.icon}.jpg`;
	}

	get afkChannel() {
		if (!this.afkChannelId)
			return false;

		return this.getChannel("id", this.afkChannelId);
	}

	get defaultChannel() {
		return this.getChannel("name", "general");
	}
	
	get owner() {
		return this.client.getUser("id", this.ownerID);
	}
	
	get users() {
		return this.members;
	}
	
	// get/set
	
	getRole(id){
		for (var role of this.roles) {
			if (role.id === id) {
				return role;
			}
		}

		return null;
	}
	
	updateRole(data){
		
		var oldRole = this.getRole(data.id);
		
		if(oldRole){
			
			var index = this.roles.indexOf(oldRole);
			this.roles[index] = new ServerPermissions(data);
			
			
			return this.roles[index];
			
		}else{
			return false;
		}
		
	}
	
	removeRole(id){
		for (var roleId in this.roles) {
			if (this.roles[roleId].id === id) {
				this.roles.splice(roleId, 1);
			}
		}
		
		for(var member of this.members){
			for(var roleId in member.rawRoles){
				if(member.rawRoles[roleId] === id){
					member.rawRoles.splice(roleId, 1);
				}
			}
		}
	}
	
	getChannel(key, value) {
		for (var channel of this.channels) {
			if (channel[key] === value) {
				return channel;
			}
		}

		return null;
	}
	
	getMember(key, value){
		for (var member of this.members) {
			if (member[key] === value) {
				return member;
			}
		}

		return null;
	}
	
	removeMember(key, value){
		for (var member of this.members) {
			if (member[key] === value) {
				this.members.splice(key, 1);
				return member;
			}
		}

		return false;
	}
	
	addChannel(chann) {
		if (!this.getChannel("id", chann.id)) {
			this.channels.push(chann);
		}
		return chann;
	}
	
	addMember(user, roles){
		if (!this.getMember("id", user.id)){
			var mem = new Member(user, this, roles);
			this.members.push(mem);
		}
		return mem;
	}
	
	toString(){
		return this.name;
	}
	
	equals(object){
		return object.id === this.id;
	}
}

module.exports = Server;