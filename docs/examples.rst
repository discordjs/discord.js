.. include:: ./vars.rst

Usage Examples
==============

Please note: Not all of these are standalone examples, many of them are usage examples.

.. warning:: Please do not copy/paste code directly from these examples. Try to learn from and adapt these pieces of code to your specific situation.

--------

Logging In
----------

Logs the Client_ in, allowing you to begin working with the Discord API.

Logging in with a username and password
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Do not use a normal user account for large or public bots. This is considered abuse of the API and can land you in trouble.**

.. code-block:: javascript
	
	const Discord = require('discord.js');
	var client = new Discord.Client();
	
	client.login('mybot@example.com', 'password', output);
	
	function output(error, token) {
		if (error) {
			console.log('There was an error logging in: ' + error);
			return;
		} else
			console.log('Logged in. Token: ' + token);
	}

Logging in with a token
~~~~~~~~~~~~~~~~~~~~~~~

You can get your bot's token using the `My Applications`_ page on the Discord Developers site.

.. code-block:: javascript
	
	const Discord = require('discord.js');
	var client = new Discord.Client();
	
	client.loginWithToken('token', output);
	
	function output(error, token) {
		if (error) {
			console.log('There was an error logging in: ' + error);
			return;
		} else
			console.log('Logged in. Token: ' + token);
	}

-----

Receiving Messages
------------------

Here we will demonstrate receiving messages and logging them to the console.

.. code-block:: javascript
	
	client.on('message', function(message) {
		if (message.channel.isPrivate) {
			console.log('(Private) ${message.author.name}: ${message.content}');
		} else {
			console.log('(${message.server.name} / ${message.channel.name}) ${message.author.name}: ${message.content}');
		}
	});
