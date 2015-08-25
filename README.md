# discord.js
Discord.js is a node module that allows you to interface with the [Discord](https://discordapp.com/) API for creation of things such as bots or loggers.

The aim of this API is to make it *really* simple to start developing your bots. This API has server, channel and user tracking, as well as tools to make identification really simple.

The new rewrite of the API (version 3+) is written in ECMAScript 6 and compiled down to EC5 using Babel. It allows the code to be written faster and more consistently, and take use of new features.

## New update break your code? Read why [here](https://github.com/discord-js/discord.js/wiki#why-did-my-code-break-with-the-new-update).

**[Find the website here.](http://discord-js.github.io)**

**[For more information, click here.](https://github.com/hydrabolt/discord.js/wiki)**

### This module is still in alpha - especially the newer versions!

This node module is still in alpha, and some methods and functions may change or completely disappear!

### Installation
``npm install --save discord.js``

### Features

* Send, Receive Delete and **Edit** messages from channels _and_ DMs! Auto-initiates DMs for you!
* Create, Delete and Leave servers and channels
* Create invites for Servers
* Silent Mention - trigger mention notification without actually @mentioning a user!
* Get complete metadata on users, channels and servers - including avatars.
* Get limitless logs from channels.
* Fast and efficient caching
* Auto-cache messages

### Example usage
```js
/*
 * A basic bot that shows how to connect to a Discord account,
 * how to listen to messages and how to send messages.
 *
 * This bot responds to every "ping" message with a "pong".
 */

var Discord = require( "discord.js" );

// Create the bot
var myBot = new Discord.Client();

// Login with an example email and password
myBot.login( "hello@example.com", "password1" );

// The "ready" event is triggered after the bot successfully connected to
// Discord and is ready to send messages.
myBot.on( "ready", function() {
	console.log( "Bot connected successfully." );
} );

// Add a listener to the "message" event, which triggers upon receiving
// any message
myBot.on( "message", function( message ) {
	// message.content accesses the content of the message as a string.
	// If it is equal to "ping", then the bot should respond with "pong".
	if ( message.content === "ping" ) {
		// Send a message ("pong") to the channel the message was sent in,
		// which is accessed by message.channel.
		this.sendMessage( message.channel, "pong" );
	}
} );
```
### TODO
* Joining servers from an invite
* Stealthy Ninja support
