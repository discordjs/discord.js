class User{
	constructor( data ){
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.id = data.id;
		this.avatar = data.avatar;
	}
	
	// access using user.avatarURL;
	get avatarURL(){
		if( !this.avatar )
			return null;
		return `https://discordapp.com/api/users/${this.id}/avatars/${this.avatar}.jpg`;
	}
	
	mention(){
		return `<@${this.id}>`;
	}
	
	toString(){
		/*
			if we embed a user in a String - like so:
			"Yo " + user + " what's up?"
			It would generate something along the lines of:
			"Yo @hydrabolt what's up?"
		*/
		return this.mention();
	}
	
	equals(object){
		return object.id === this.id;
	}
}

module.exports = User;