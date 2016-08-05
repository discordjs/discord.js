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

Logging Out
----------

The logOut function should be used if you intend to reconnect with the same process. The function takes one parameter, which is a callback.

.. code-block:: javascript

	client.logOut((err) => {
		console.log(err);
	});


However, if you want to completely shut down your application, use destroy.

.. code-block:: javascript

	client.destroy((err) => {
		console.log(err);
	});

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

To a specific server and channel
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends "Hello" to the default Channel_ in the Server_ "My Server". Note that this does not require any sort of received message to be activated, however if there are multiple servers with the name "My Server", a random one will be chosen.

See Cache_ for more details on getting specific objects and resolvables.

.. code-block:: javascript

	var channel = client.servers.get("name", "My Server").defaultChannel;
	client.sendMessage(channel, "Hello");

Private Messages
~~~~~~~~~~~~~~~~

You can also send private messages to a user with a User_ object. This will send "Hello!" as a private message to the original author of the received message.

Do note however, that a PMChannel_ is not the same as a ServerChannel_ and therefore does not have the same properties such as ``server`` and ``name``.

.. code-block:: javascript

	client.on('message', function(message) {
		client.sendMessage(message.author, "Hello!");
	});


-----

Sending files
-----------------

The process of sending file is similar to how you send messages.

The first parameter takes an `Channel Resolvable`_ or `User Resolvable`_. The User Resolvable sends the file as an DM, and the Channel Resolvable to a text channel. 

The next parameter is a `File Resolvable`_.

The third parameter lets you name your file. This is optional.

The fourth paramter lets you add a message. This is optional.

The last paramtere is a callback. It takes an error and a `Message`_ object.

URL
~~~~~~~~~~~~~~~~

.. code-block:: javascript

	client.on('message', function(message) {
		client.sendFile(message, 'http://i.imgur.com/6CbxaPc.jpg', 'kappa.jpg', 'Check out this cool file!', (err, m) => {
			if (err) console.log(err);
		});
	});

Local file 
~~~~~~~~~~~~~~~~

.. code-block:: javascript

	client.on('message', function(message) {
		client.sendFile(message, '/assets/dank_meme.jpg', 'dank_meme.jpg', 'Check out this cool file!', (err, m) => {
			if (err) console.log(err);
		});
	});

Buffer
~~~~~~~~~~~~~~~~

Send data from streams.

.. code-block:: javascript

	const fs = require('fs');

	client.on('message', function(message) {
		var stream = fs.createReadStream('/assets/dank_meme.jpg');
		var chunks = [];
		stream.on('data', (dataChunk) => {
			chunks.push(dataChunk);
		});

		stream.on('end' () => {
			client.sendFile(message, Buffer.concat(chunks), 'dank_meme.jpg', 'Check out this cool file!');
		});
	});

-----

Deleting messages
-----------------

The deleteMessage function takes an `Message Resolvable`_ as the first paramter. The second parameter is a callback.

This snippet will delete the received message. 

.. code-block:: javascript

	client.on('message', function(message) {
		client.deleteMessage(message);
	});


You can also delete multiple messages with the deleteMessages function. It takes an array of `Message Resolvable`_ s.

This code deletes all the messages recieved every 10 seconds.

.. code-block:: javascript

	var messages = [];

	client.on('message', function(message) {
		messages.push(message);
	});

	function clear() {
		client.deleteMessages(messages);
		messages = [];
	}

	setInterval(clear, 10000);


-----