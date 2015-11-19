.. include:: ./vars.rst

Client
======

This page contains documentation on the `Discord.Client` class. This should be used when you want to start creating things with the API.

Attributes
----------

users
~~~~~

A Cache_ of User_ objects that the client has cached.

channels
~~~~~~~~

A Cache_ of ServerChannel_ objects that the client has cached.

privateChannels
~~~~~~~~~~~~~~~

A Cache_ of PMChannel_ objects that the client has cached. These are all the Private/Direct Chats the client is in.

servers
~~~~~~~

A Cache_ of Server_ objects that the client has cached.

voiceConnection
~~~~~~~~~~~~~~~

A VoiceConnection_ object that is the current voice connection (if any).

readyTime
~~~~~~~~~

A `Number` unix timestamp dating to when the Client emitted `ready`.

uptime
~~~~~~

A `Number` in milliseconds representing how long the Client has been ready for.

user
~~~~

A User_ object representing the logged in client's user.

Functions
---------

.. note :: Any functions used here that take callbacks as an optional parameter can also be used as Promises_. Promises take the exact same parameters for each use case, except errors are moved to catch statements instead of then. For example, you can do:

.. code-block:: js

    bot.login(email, password).then(success).catch(err);
    
    function success(token){
    
    }
    
    function err(error){
    
    }
    
    // OR use callbacks:
    
    bot.login(email, password, function(error, token){
    
    });
	
login(email, password, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Logs the client in so it can begin initialising. Use this `after` registering your events to ensure they are called!

- **email** - The e-mail used to sign in, `String`.
- **password** - The password used to sign in, `String`.
- **callback** - `function` that takes the following parameters:

	- **error** - An error if any occurred
	- **token** - The token received after logging in, `String`.

logout(`callback`)
~~~~~~~~~~~~~~~~~~

Logs the client out and closes the WebSocket connections.

- **callback** - `function` that takes the following parameter:

	- **error** - An error if any occurred
	
sendMessage(channel, content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends a message to the specified channel.

- **channel** - a `Channel Resolvable`_
- **content** - a `String Resolvable`_ - the message you want to send
- **options** - `object` containing:

	- **tts** - `Boolean`, should message be text-to-speech
- **callback** - `function` that takes the following parameters:

	- **error** - error object if any occurred
	- **message** - the sent Message_
	
sendFile(channel, attachment, name, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends a file to the specified channel.

- **channel** - a `Channel Resolvable`_
- **attachment** - A ReadableStream, String or Buffer
- **name** - `String`, name of the file containing the extension
- **callback** - `function` taking the following:

	- **error** - error if any occurred
	- **message** - the sent Message_
	
reply(message, content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Shortcut to `sendMessage` but prepends a mention to the sender of the original message to the start of your message.

- **message** - The Message_ to reply to
- **content** - a `String Resolvable`_ - the message you want to send
- **options** - `object` containing:

	- **tts** - `Boolean`, should message be text-to-speech
- **callback** - `function` that takes the following parameters:

	- **error** - error object if any occurred
	- **message** - the sent Message_
	
deleteMessage(message, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Attempts to delete a message

- **message** - The Message_ to delete
- **options** - `object` containing the following:

	- **wait** - Milliseconds as a `number` to wait before deleting the message
- **callback**

	- **error** - error object if any occurred
	
updateMessage(message, content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Updates the content of a previously sent message

- **message** - The Message_ to update
- **content** - a `String Resolvable`_ - the content you want to update the message with
- **options** - `object` containing:

	- **tts** - `Boolean`, should message be text-to-speech
- **callback** - `function` that takes the following parameters:

	- **error** - error object if any occurred
	- **message** - the sent Message_
	
getChannelLogs(channel, `limit`, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a list of previously sent messages in a channel.

- **channel** - The Channel_ to get messages from
- **limit** - The maximum amount of messages to retrieve - defaults to 500. A `Number`
- **options** - An `object` containing either of the following:

	- **before** - A `Message Resolvable` - gets messages before this message.
	- **after** - A `Message Resolvable` - gets messages after this message.
- **callback** - `function` taking the following:

	- **error** - error if any occurred
	- **messages** - `array` of Message_ objects sent in channel
	
getBans(server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a list of banned users in a server.

- **server** - `Server Resolvable` - The server to get banned users of
- **callback** - `function` taking the following:

	- **error** - error if any occurred
	- **users** - `array` of banned users in the server
	
joinServer(invite, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Joins a server from the given invite

- **invite** - an `Invite Resolvable`_
- **callback** - `function` taking the following:

	- **error** - error if any occurred
	- **server** - the joined Server_
	
createServer(name, region, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a server

- **name** - `String`, name of the server
- **region** - `String`, region of the server, currently **us-west, us-east, singapore, london, sydney** or **amsterdam**
- **callback** - `function` taking the following:
	
	- **error** - error if any occurred
	- **server** - the created Server_
	
leaveServer(server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Leaves/deletes a server that the client is in

- **server** - a `Server Resolvable`_
- **callback** - `function` taking the following:
	
	- **error** - error if any occurred
	
createChannel(server, name, `type`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a channel in a server

- **server** - a `Server Resolvable`_
- **name** - `String`, name of the channel. Spaces not allowed.
- **type** -  defaults to `text`, but can also be `voice`
- **callback** - `function` taking the following:
	
	- **error** - error if any occurred
	- **channel** - the created ServerChannel_
	
deleteChannel(channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deletes a channel in a server.

- **channel** - a `Channel Resolvable`_ to delete
- **callback** - `function` taking the following:

	- **error** - error if any occurred.
	
banMember(user, server, `length`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Bans a user from a server.

- **user** - A `User Resolvable`_ to ban
- **server** - A `Server Resolvable`_ to ban the user from
- **length** - `Number`, how many days to go back and delete messages from that user
- **callback** - `function` taking the following:

	- **error** - error if any occurred.
	
unbanMember(user, server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Unbans a user from a server.

- **user** - A `User Resolvable`_ to unban
- **server** - A `Server Resolvable`_ to unban the user from
- **callback** - `function` taking the following:

	- **error** - error if any occurred.
	
kickMember(user, server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Removes a user from a server

- **user** - A `User Resolvable`_ to kick
- **server** - A `Server Resolvable`_ to kick the user from
- **callback** - `function` taking the following:

	- **error** - error if any occurred.