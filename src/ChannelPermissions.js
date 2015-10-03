class ChannelPermissions{
	constructor(data){
		
		function getBit(x) {
			return ((this.packed >>> x) & 1) === 1;
		}
		
		this.type = data.type; //either member or role
		
		this.id = data.id;
		
		this.deny = data.deny;
		
		this.allow = data.allow;
		
	}
	
	getBit(x) {
		return ((this.packed >>> x) & 1) === 1;
	}
}

module.exports = ChannelPermissions;