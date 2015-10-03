class ChannelPermissions{
	constructor(data){
		
		this.type = data.type; //either member or role
		
		this.id = data.id;
		
		this.deny = data.deny;
		
		this.allow = data.allow;
		
	}
}

module.exports = ChannelPermissions;