var User = require( "./user.js" ).User;
var List = require( "./list.js" ).List;
/**
 * A wrapper for Server information, contains channels and users too. Developers should not instantiate the class, instead they should
 * manipulate Server objects given to them.
 * @class Server
 * @param {String} region The region of the server
 */
exports.Server = function( region, ownerID, name, id, members, icon, afkTimeout, afkChannelId ) {

	/**
	 * The region of the Server
	 * @type {String}
	 * @attribute region
	 */
	this.region = region;
	/**
	 * The ID of the owner of the Server (not a User!)
	 * @type {String}
	 * @attribute ownerID
	 */
	this.ownerID = ownerID;
	/**
	 * The name of the Server
	 * @type {String}
	 * @attribute name
	 */
	this.name = name;
	/**
	 * The ID of the Server
	 * @type {String}
	 * @attribute id
	 */
	this.id = id;
	/**
	 * List containing members of the Server
	 * @param {List}
	 * @attribute members
	 */
	this.members = new List( "id" );
	/**
	 * List containing channelss of the Server
	 * @param {List}
	 * @attribute channels
	 */
	this.channels = new List( "id" );
	/**
	 * ID of the Icon of the Server
	 * @param {String}
	 * @attribute icon
	 */
	this.icon = icon;
	/**
	 * The amount of seconds that should pass before the user is
	 * @type {Number}
	 * @attribute afkTimeout
	 */
	this.afkTimeout = afkTimeout;
	/**
	 * The ID of the AFK Channel, evaluates to false if doesn't exist.
	 * @type {String}
	 * @attribute afkChannelid
	 */
	this.afkChannelId = afkChannelId;

	for ( x in members ) {
		var member = members[ x ].user;
		this.members.add( new User( member ) );
	}
}

/**
 * Returns a valid URL pointing towards the server's icon if it has one.
 * @method getIconURL
 * @return {String/Boolean} If there is an icon, a URL is returned. If not, false is returned.
 */
exports.Server.prototype.getIconURL = function(){
	if(!this.icon)
		return false;
	return "https://discordapp.com/api/guilds/"+this.id+"/icons/"+this.icon+".jpg";
}

/**
 * Returns the AFK Channel if a server has one
 * @method getAFKChannel
 * @return {Channel/Boolean} If there is an AFK Channel, a Channel is returned. If not, false is returned.
 */
exports.Server.prototype.getAFKChannel = function(){

	if(!this.afkChannelId)
		return false;

	return this.channels.filter("id", this.afkChannelId, true);

}

/**
 * Returns the #general channel of the server.
 * @method getDefaultChannel
 * @return {Channel} Returns the #general channel of the Server.
 */
exports.Server.prototype.getDefaultChannel = function() {

	return this.channels.filter( "name", "general", true );

}
