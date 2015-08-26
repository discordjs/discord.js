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
				this.members.push(client.addUser(member.user));

		}
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
	
	// get/set
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
	
	addChannel(chann) {
		if (!this.getChannel("id", chann.id)) {
			this.channels.push(chann);
		}
		return chann;
	}
	
	addMember(member){
		if (!this.getMember("id", member.id)){
			this.members.push(member);
		}
		return member;
	}
	
	toString(){
		return this.name;
	}
}

module.exports = Server;