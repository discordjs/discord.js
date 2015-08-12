var Discord = require( "discord.js" );
var myBot = new Discord.Client();

myBot.login( "hello@example.com", "password1" );

myBot.on( "message", function( message ) {
	if ( message.content === "$avatar" ) {
		var user = message.author; //the user who wants an avatar is the author
		if ( user.avatar ) {
			var url = "https://discordapp.com/api/users/" + user.id + "/avatars/" + user.avatar + ".jpg";
			bot.sendMessage( message.channel, message.author.mention() + ", here's your avatar: " + url );
		} else {
			bot.sendMessage( message.channel, message.author.mention() + ", you don't have an avatar!" );
		}
	}
} );
