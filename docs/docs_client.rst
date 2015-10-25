.. include:: ./vars.rst

Client Documentation
====================

This page contains documentation on the `Discord.Client` class. This should be used when you want to start creating things with the API.

It might be beneficial to use CTRL+F to search for what you're looking for, or use the navigation provided by readthedocs on the left.

Attributes
----------

options
~~~~~~~
An `Object` containing a configuration for the Client. Currently can only be configured like so:

.. code-block:: js

    {
        queue : false // whether messages should be sent one after the other or
                      // just send straight away.
    }

token
~~~~~
A `String` that is the token received after logging in. It is used to authorise the Client when joining WebSockets or making HTTP requests. Example token:

.. code-block:: js

    ODAzTOc4MTA2BjQ2MjY4ODg.COmrCA.fEtD_Tc0JU6iZJU_11coEWBOQHE

state
~~~~~
An `Integer` representing what state of connection the Client is in.

- **0** is idle, meaning the Client has been created but no login attempts have been made.
- **1** is logging in, meaning the Client is in the process of logging in.
- **2** is logged in, meaning the Client is logged in but not necessarily ready.
- **3** is ready, meaning the Client is ready to begin listening.
- **4** is disconnected, meaning the Client was disconnected due to any reason.

See also ready_.

.. code-block:: js

    if( bot.state === 3 ) // ready to go
    
user
~~~~
A `User`_ object representing the account of the signed in client. This will only be available when the client is in the ready state (3).
    
.. code-block:: js

    bot.user.username; // username of the account logged in
    
email
~~~~~
A `String` that is the email used to sign the client in.

password
~~~~~~~~
A `String` that is the password used to sign the client in.
    
readyTime
~~~~~~~~~
A `Number` representing the unix timestamp from when the client was ready. `Null` if not yet ready.

.. code-block:: js

    bot.readyTime; // 1443378242464
    
uptime
~~~~~~
A `Number` representing how many milliseconds have passed since the client was ready. `Null` if not yet ready.

.. code-block:: js

    if( bot.uptime > 5000 ) // true if the client has been up for more than 5 seconds

ready
~~~~~
A `Boolean` that is true if the client is ready. A shortcut to checking if ``bot.state === 3``.

servers
~~~~~~~
An `Array` of Server_ objects that the client has access to.

channels
~~~~~~~~
An `Array` of Channel_ objects that the client has access to.

users
~~~~~
An `Array` of User_ objects that the client has access to.

PMChannels
~~~~~~~~~~
An `Array` of PMChannel_ objects the client has access to.

messages
~~~~~~~~
An `Array` of Message_ objects the client has received over its uptime.

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
    
-----

login(email, password, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Logs the client in to set it up. Use this after registering your event listeners to ensure they are called.

- **email** - A `String` which is the email you want to sign in with.
- **password** - A `String` which is the password you want to sign in with.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **token** - if successful, it is the received authorisation token.
    
logout(`callback`)
~~~~~~~~~~~~~~~~~~

Logs the client out if it is logged in. If successful, ``bot.state == 4``.

- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    
createServer(name, region, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a server with the specified name or region. See valid regions below:

- **name** - A `String` that will be the name of your server.
- **region** - A `String` that is a valid Discord region. Currently **us-west**, **us-east**, **singapore**, **london**, **sydney** or **amsterdam**. Providing an invalid region will result in an error. To find the latest available regions, check the `official API here`_.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **server** - A Server_ that represents the created Server.
    
joinServer(invite, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Accepts a given invite to join a server. The server is automatically cached ASAP.

- **invite** - An `Invite Resolvable`_ which is the invite that should be accepted.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **server** - A Server_ that represents the joined Server.
    
leaveServer(server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Leaves the given server.

- **server** -  A `Server Resolvable`_ that represents the server you want to leave.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    
createInvite(channel, options, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates an invite for the given channel and returns an Invite_.

- **channel** - A `Channel Resolvable`_ that is the channel you want to create an invite for.
- **options** - An `object` containing configurable options for the invite. See below for possible configurations.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **invite** - An Invite_ object that contains the details about the created invite.
    
.. code-block:: js

    // default configuration of the options variable:

    options = {
        max_age : 0, //A number signifying the expiry time for the invite. 0 means infinite.
        max_uses : 0, //A number signifying the amount of uses of the invite. 0 means infinite.
        temporary : false, //boolean - whether users who use it are kicked unless promoted within 24h.
        xkcd : false //boolean - whether the invite's URL should be human-readable
    }
    
createChannel(server, channelName, channelType, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a channel in the given server.

- **server** - A `Server Resolvable`_ that will be the server the channel is created in.
- **channelName** - A `String` that is the name of the channel.
- **channelType** - A `String` that is the type of the channel, either **voice** or **text**.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **channel** - An Channel_ object that represents the created channel.
    
deleteChannel(channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deletes the specified channel.

- **channel** - A `Channel Resolvable`_ that will be the channel to delete.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    
getChannelLogs(channel, `amount`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets previous messages from the specified channel.

- **channel** - A `Channel Resolvable`_ to take logs from.
- **amount** - A `Number` that defaults to **500**. This is the amount of messages to try and get.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **logs** - An `Array` of Message_ objects that represent the previous messages.
    
.. warning:: If the logs contain messages from a user who is no longer in the server, the user object *MAY* be malformed.

sendMessage(channel, message, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends a message to the specified channel.

- **channel** - A `Channel Resolvable`_ to send the message to.
- **message** - A `String` or an Array of strings. If an Array, the array will be joined with a new line as a delimiter and this will be the message to be sent.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **message** - A Message_ representing the sent message.
    
sendFile(channel, file, `fileName`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends a file to the specified channel. Note that **fileName is necessary in certain cases** for when a file other than an image is sent. For example, if you send a file containing JS code, fileName should be something like ``myCode.js``.

- **channel** - A `Channel Resolvable`_ to send the file to.
- **file** - The file to send, either a `Buffer` or `String` - if a String, it should be a relative (`./`) or absolute path to a file.
- **fileName** - A `String` containing the file's name and extension, used by Discord (I didn't make this please don't shoot me :s) Examples include `picture.png`, `text.txt`, `wowanamazingscript.js`

- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **message** - A Message_ representing the sent file.
    
updateMessage(message, content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Updates/edits a message with new content.

- **message** - A Message_ that should be updated.
- **content** - A `String` or an Array of strings. If an Array, the array will be joined with a new line as a delimiter and this will be the message to be sent.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **message** - A Message_ representing the updated message.
    
reply(message, yourMessage, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Alias for sendMessage, but prepends a mention to whoever sent the specified mention. Useful shortcut for directing a message at a user.

.. code-block:: js

    // example usage:
    
    the user 'bob' sent a message
    
    bot.reply(message, "hello");
    // will send the message '@bob, hello' to the channel the message that bob sent was in.
    
- **message** - A Message_ that should be replied to.
- **yourMessage** - A `String` or an Array of strings. If an Array, the array will be joined with a new line as a delimiter and this will be the message to be sent.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    - **message** - A Message_ representing the sent message.
    
setUsername(newName, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the username of the logged in client.

- **newName** - The new name of the client, a `String`.
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.
    
startTyping(channel, *stopTime*)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Makes the client appear to be typing in the specified channel.

- **channel** - A `Channel Resolvable`_ that should be the channel to start typing in
- **stopTime** - A `Number` in ms which should make the client stop typing after. Allow 5 seconds.

stopTyping(channel)
~~~~~~~~~~~~~~~~~~~

Makes the client stop typing in a specified channel.

- **channel** - A `Channel Resolvable`_ that should be the channel to stop typing in.

setStatusOnline()
~~~~~~~~~~~~~~~~~

**Aliases**: ``setStatusActive()`` and ``setStatusHere()``

Sets the client's status to online; green.

setStatusIdle()
~~~~~~~~~~~~~~~~~

**Aliases**: ``setStatusAway()``

Sets the client's status to idle; orange.

setTopic(channel, topic, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the topic of the specified channel

- **channel** - A `Channel Resolvable`_ that is the channel you want to change the topic of
- **topic** - A `String` that is the topic you want
- **callback** - A `function` that can take the following parameters:

    - **error** - An error if one occurred, otherwise it is null.

getUser(key, value)
~~~~~~~~~~~~~~~~~~~

Gets a User_ that matches the specified criteria. E.g:

.. code-block:: js

    bot.getUser("id", 1243987349) // returns a user where user.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value

getServer(key, value)
~~~~~~~~~~~~~~~~~~~~~

Gets a Server_ that matches the specified criteria. E.g:

.. code-block:: js

    bot.getServer("id", 1243987349) // returns a server where server.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value


getChannel(key, value)
~~~~~~~~~~~~~~~~~~~~~~

Gets a Channel_ that matches the specified criteria. E.g:

.. code-block:: js

    bot.getChannel("id", 1243987349) // returns a Channel where channel.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value


getPMChannel(key, value)
~~~~~~~~~~~~~~~~~~~~~~~~

Gets a PMChannel_ that matches the specified criteria. E.g:

.. code-block:: js

    bot.getPMChannel("id", 1243987349) // returns a PMChannel where pmchannel.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value

setPlayingGame(id)
~~~~~~~~~~~~~~~~~~

**Aliases** : `playGame`, `playingGame`

Sets the client as playing the specified game name/id.

- **id** - Either a `Number` or a `String`. If it's a Number, it's assumed that you are using a `Discord Game ID`_ and know what you want. If you supply a `String`, it will assume you are entering a game name and try resolving it to a Discord Game ID if it's available. Example:

.. code-block:: js
    
    client.setPlayingGame(18);
    // sets the client as playing Minecraft, game ID 18
    
    client.setPlayingGame("Minecraft");
    // sets the client as playing Minecraft by resolving the ID to 18
    
    client.setPlayingGame("my magical made up game")
    // will stop the client from playing anything as it is unresolved, not a valid game.

-----

Event Management
----------------

Events are a useful way of listening to events and are available in every API.

Registering Events
~~~~~~~~~~~~~~~~~~

.. code-block:: js

    bot.on("eventName", function(arg1, arg2...){
        // code here is called when eventName is emitted.
    })
    
.. note:: You can only have one listening function per event

Unregistering Events
~~~~~~~~~~~~~~~~~~~~

.. code-block:: js

    bot.off("eventName")
    // eventName is no longer listened for
    
Event Types
-----------

ready
~~~~~

Called when the bot is ready and you can begin working with it.

disconnected
~~~~~~~~~~~~

Called when the bot is disconnected for whatever reason.

error
~~~~~

Called whenever there is an error.

**Parameters**

- **error** - the encountered error

.. note:: There may be more parameters supplied depending on the errors. Use the ``arguments`` variable to check for this for advanced debugging.

debug
~~~~~

Called when the client debugs some information that might be useful for a developer but not for an end user.

**Parameters**

- **message** - the debug message as a `String`

message
~~~~~~~

Called when a message has been received by the client.

**Parameters**

- **message** - the received Message_.

messageDelete
~~~~~~~~~~~~~

Called when a message has been deleted.

**Parameters**

- **channel** - The Channel_ that the deleted message was in.
- **message** - *May* be available. If the message wasn't previously cached, this will not be supplied and all you would know is that a message was deleted in the channel. If it is available, it will be in the format of a Message_.

messageUpdate
~~~~~~~~~~~~~

Called when a message has been updated.

**Parameters**

- **newMessage** - The updated Message_.
- **oldMessage** - The old Message_ before it was updated.

serverDelete
~~~~~~~~~~~~

Called when a server is deleted.

**Parameters**

- **server** - The deleted Server_.

channelDelete
~~~~~~~~~~~~~

Called when a channel is deleted.

**Parameters**

- **channel** - The deleted Channel_.

serverCreate
~~~~~~~~~~~~

Called when a server is created/joined.

**Parameters**

- **server** - The created Server_.

channelCreate
~~~~~~~~~~~~

Called when a channel is created.

**Parameters**

- **channel** - The created Channel_.

serverNewMember
~~~~~~~~~~~~~~~

Called when a new member is added to a server.

**Parameters**

- **user** - The User_ that was added.
- **server** - The Server_ that the user was added to.

serverRemoveMember
~~~~~~~~~~~~~~~~~~

Called when a member of a server leaves or is kicked out.

**Parameters**

- **user** - The User_ that was removed.
- **server** - The Server_ that the user was removed from.

userUpdate
~~~~~~~~~~

Called when information about a user changes, such as their username.

**Parameters**

- **newUser** - A User_ object representing the changes to the old user (this will be in the cache)
- **oldUser** - A User_ object representing the user before the update.

presence
~~~~~~~~

Called when a user goes online/offline/away or starts/stops playing a game.

**Parameters**

- **dataObject** - Instead of separate arguments, presence update takes an object containing the following information:

    - **user** - A User_ representing the User that had a presence update
    - **status** - The status change as a `String`.
    - **server** - The Server_ that the presence change occurred in.
    - **gameId** - A `Number` representing the game they are playing if any. Currently, discord.js has no internal support for converting this into a game name.
    
unknown
~~~~~~~

Called when an unknown packet was received or there is no handler for it.

**Parameters**

- **data** - A `JSON Object` which is the message received over WebSocket.

raw
~~~

Called when a WebSocket message is received and it gives you the message.

**Parameters**

- **data** - A `JSON Object` which is the message received over WebSocket.

.. _official API here : https://discordapp.com/api/voice/regions

.. _Discord Game ID : https://raw.githubusercontent.com/hydrabolt/discord.js/master/ref/gameMap.json