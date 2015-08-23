var User = require( "./user.js" ).User;
var List = require( "./list.js" ).List;
exports.Server = function( data ) {
	this.region = data.region;
	this.ownerID = data.owner_id;
	this.name = data.name;
	this.id = data.id;
	this.members = new Map();
	this.channels = new Map();
	this.icon = data.icon;
	this.afkTimeout = data.afk_timeout;
	this.afkChannelId = data.afk_channel_id;

	for ( var x in members ) {
		var member = members[ x ].user;
		this.members.add( new User( member ) );
	}
}

exports.Server.prototype.getIconURL = function(){
	if(!this.icon)
		return false;
	return "https://discordapp.com/api/guilds/"+this.id+"/icons/"+this.icon+".jpg";
}

exports.Server.prototype.getAFKChannel = function(){

	if(!this.afkChannelId)
		return false;

	return this.channels.filter("id", this.afkChannelId, true);

}

exports.Server.prototype.getDefaultChannel = function() {

	return this.channels.filter( "name", "general", true );

}
