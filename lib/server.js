var User = require( "./user.js" ).User;
var List = require( "./list.js" ).List;
exports.Server = function( region, ownerID, name, id, members, icon, afkTimeout, afkChannelId ) {

	this.region = region;
	this.ownerID = ownerID;
	this.name = name;
	this.id = id;
	this.members = new List( "id" );
	this.channels = new List( "id" );
	this.icon = icon;
	this.afkTimeout = afkTimeout;
	this.afkChannelId = afkChannelId;

	for ( x in members ) {
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
