.. include:: ./vars.rst

Usage Examples
==============

Not all of these are standalone examples, many of them are usage examples. If you're a beginner to Discord.js, we encourage you to look through these examples to get a hang of the way things work using the library.

.. warning :: Please do not copy/paste code directly from these examples. Try to learn from and adapt these pieces of code to your specific situation.

.. note :: We use `Template Literals`_ in these examples. These are an ES6 feature and may not be fully supported in your environment. In this case, it is safe to use other methods of concatenating strings.

-----

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
			console.log(`There was an error logging in: ${error}`);
			return;
		} else
			console.log(`Logged in. Token: ${token}`);
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
			console.log(`There was an error logging in: ${error}`);
			return;
		} else
			console.log(`Logged in. Token: ${token}`);
	}

-----

Receiving Messages
------------------

Here we will demonstrate receiving messages and logging them to the console.

.. code-block:: javascript

	client.on('message', function(message) {
		if (message.channel.isPrivate) {
			console.log(`(Private) ${message.author.name}: ${message.content}`);
		} else {
			console.log(`(${message.server.name} / ${message.channel.name}) ${message.author.name}: ${message.content}`);
		}
	});

-----

Sending messages
-----------------

In the same channel
~~~~~~~~~~~~~~~~~~~

This is by far the most common way people will send a message in the Discord API. Here we will send a message to the same Channel_ we received a message from in the above example.

.. code-block:: javascript
	
	client.on('message', function(message) {
		// Don't forget to log the message!
		client.sendMessage(message.channel, "Hello!");
	});

You can also use a `Message`_ resolvable as an parameter. This example does the same thing as above.

.. code-block:: javascript

	client.on('message', function(message) {
		client.sendMessage(message, "Hello!");
	});
	
You can also directly reply to messages. This does the same as adding an @mention in front of your text.

Sends "@author Hello!"

.. code-block:: javascript

	client.on('message', function(message) {
		client.reply(message, "Hello!");
	});

Sending message to a specific channel
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends "Hello" to the default Channel_ in the Server_ "My Server". Note that this does not require any sort of received message to be activated, however if there are multiple servers with the name "My Server", a random one will be chosen.

See Cache_ for more details on getting specific objects and resolvables.

.. code-block:: javascript

	var channel = client.servers.get("name", "My Server").defaultChannel;
	client.sendMessage(channel, "Hello");

Sending private messages
~~~~~~~~~~~~~~~~~~~~~~~~

You can also send private messages to a user with a User_ object. This will send "Hello!" as a private message to the original author of the received message.

Do note however, that a PMChannel_ is not the same as a ServerChannel_ and therefore does not have the same properties such as ``server`` and ``name``.

.. code-block:: javascript

	client.on('message', function(message) {
		client.sendMessage(message.author, "Hello!");
	});


-----