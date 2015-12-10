.. include:: ./vars.rst

Client
======

**extends** EventEmitter_

This page contains documentation on the `Discord.Client` class. This should be used when you want to start creating things with the API.

--------

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

userAgent
~~~~~~~~~

An object containing `url`, `version` and `full`.
Setting this property allows the discord developers to keep track of active bots,
it defaults to the discord.js git repo and the current version of the package.
`url` should be the repository/homepage of the creator.
`version` should be the version of your bot.
`full` is read only and will be automatically generated upon setting.

-----

Functions
---------

.. note :: Any functions used here that take callbacks as an optional parameter can also be used as Promises_. Promises take the exact same parameters for each use case, except errors are moved to catch statements instead of then. For example, you can do:

    .. code-block:: js

        bot.login(email, password).then(success).catch(err);

        function success(token){
            // handle success
        }

        function err(error){
            // handle error
        }

    or use callbacks:

    .. code-block:: js

        bot.login(email, password, function(error, token){
            // handle error and success
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

deleteMessage(message, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Attempts to delete a message

- **message** - The Message_ to delete
- **options** - `object` containing the following:
    - **wait** - Milliseconds as a `number` to wait before deleting the message
- **callback**
    - **error** - error object if any occurred

getChannelLogs(channel, `limit`, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a list of previously sent messages in a channel.

- **channel** - The Channel_ to get messages from
- **limit** - The maximum amount of messages to retrieve - defaults to 500. A `Number`
- **options** - An `object` containing either of the following:
    - **before** - A `Message Resolvable`_ - gets messages before this message.
    - **after** - A `Message Resolvable`_ - gets messages after this message.
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **messages** - `array` of Message_ objects sent in channel

getBans(server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a list of banned users in a server.

- **server** - `Server Resolvable`_ - The server to get banned users of
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

createInvite(channel, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates an invite for the specified channel (or server)

- **channel** - A `Channel Resolvable`_
- **options** - `object` containing:
    - **maxAge** - `Number` for maximum time in seconds for invite's validity
    - **maxUses** - `Number`, maximum uses of invite
    - **temporary** - `Boolean`, whether the invite should be temporary
    - **xkcd** - `Boolean`, whether the invite should be human-readable-friendly.
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **invite** - the created Invite_

deleteInvite(invite, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deletes an invite

- **invite** - An `Invite ID Resolvable`_
- **callback** - a `function` taking the following:
    - **error** - error if any occurred

setStatus(status, `game`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the Discord Status of the Client

- **status** - `String`, either ``online, here, active, available`` or ``idle, away``
- **game** - `String/Number`, ID of Discord Game being played
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setStatusIdle()
~~~~~~~~~~~~~~~

**Alias:** `setStatusAway`

Sets the status of the Client to Idle/Away

setStatusOnline()
~~~~~~~~~~~~~~~

**Aliases:** `setStatusHere`, `setStatusActive`, `setStatusAvailable`

Sets the status of the Client to Online

setTopic(channel, topic, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the topic of a channel

- **channel** - A `Channel Resolvable`_
- **topic** - A `String`
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setChannelName(channel, name, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the name of a channel

- **channel** - A `Channel Resolvable`_
- **name** - A `String`
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setChannelNameAndTopic(channel, name, topic, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the name and topic of a channel

- **channel** - A `Channel Resolvable`_
- **name** - A `String`
- **topic** - A `String`
- **callback** - `function` taking the following:
    - **error** - error if any occurred

startTyping(channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Marks the client as typing in a channel.

- **channel** - A `Channel Resolvable`_
- **callback** - `function` taking the following:
    - **error** - error if any occurred

stopTyping(channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Marks the client as not typing in a channel (takes a few seconds to go active).

- **channel** - A `Channel Resolvable`_
- **callback** - `function` taking the following:
    - **error** - error if any occurred

updateDetails(details, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Updates the details of the client

- **details** - `object` containing any of the following:
    - **avatar** - `Base64 Resolvable`_, new avatar of the client
    - **email** - `String`, new email of the client
    - **newPassword** - `String`, new password of the client
    - **username** - `String`, new username of the client
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setAvatar(avatar, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the avatar of the client

- **avatar** - `Base64 Resolvable`_, new avatar of the client
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setUsername(name, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the username of the client

- **username** - `String`, new username of the Client
- **callback** - `function` taking the following:
    - **error** - error if any occurred

joinVoiceChannel(channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Joins a Voice Channel to begin transmitting audio

- **channel** - A `VoiceChannel Resolvable`_
- **callback** - `function` that takes the following:
    - **error** - error if any occurred
    - **connection** - VoiceConnection_, the created Voice Connection.

leaveVoiceChannel(`callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Leaves the currently connected Voice Channel if connected

- **callback** - `function` that takes the following:
    - **error** - error if any occurred

createRole(server, `data`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a new role in a server.

- **server** - a `Server Resolvable`_
- **data** - `object` containing the structure below
- **callback** - `function` that takes the following:
    - **error** - error if any occurred
    - **role** - the created Role_

.. code-block:: js

    // structure of data parameter (all attrs optional):
    {
        color : 0xFF0000,
        hoist : false,
        name : "A New Role!",
        permissions : [
            // see the constants documentation for full permissions
            "attachFiles", "sendMessages"
        ]
    }

updateRole(role, data, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Updates a role in a server.

- **role** - a Role_
- **data** - an `object` taking the structure shown below
- **callback** - a `function` taking the following:
    - **error** - error if any occurred
    - **role** - the updated Role_

.. code-block:: js

    // structure of data parameter (all attrs optional):
    {
        color : 0xFF0000,
        hoist : false,
        name : "A New Role!",
        permissions : [
            // see the constants documentation for full permissions
            "attachFiles", "sendMessages"
        ]
    }

deleteRole(role, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deletes a role from a server

- **role** - The Role_ to delete
- **callback** - `function` that takes the following:
    - **error** - error if any occurred

addMemberToRole(member, role, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Aliases** : `addUserToRole`

Adds a member of a server to a role in the server

- **member** - A `User Resolvable`_
- **role** - A Role_
- **callback** - `function` that takes the following:
    - **error** - error if any occurred

removeMemberFromRole(member, role, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Aliases** : `removeUserFromRole`

Removes a member of a server from a role in the server

- **member** - A `User Resolvable`_
- **role** - A Role_
- **callback** - `function` that takes the following:
    - **error** - error if any occurred

overwritePermissions(channel, roleOrUser, options, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Overwrites the permissions of a role or a user in a channel

- **channel** - a `Channel Resolvable`_
- **roleOrUser** - a Role_ or a User_ object
- **options** - an `object` containing a structure as shown below
- **callback** - `function` that takes the following:
    - **error** - error if any occurred

.. code-block:: js

    {
        "sendMessages" : false,
        "attachFiles" : true
    }

Events
------

`Discord.Client` is an EventEmitter, so you can use `.on()` and `.off()` to add and remove events.

ready
~~~~~

Emitted when the client is ready to use

debug
~~~~~

Emitted when the client debugs or wants to log something internally

message
~~~~~~~

Emitted when the client receives a message, supplies a Message_ object.

warn
~~~~

Emitted when the client has encountered a small error that can be avoided.

messageDeleted
~~~~~~~~~~~~~~

Emitted when a message has been deleted and the Client finds out, supplies a Message_ object IF available, and a Channel_ object.

messageUpdated
~~~~~~~~~~~~~~

Emitted when a message has been updated and the client finds out. Supplies two Message_ objects, the first being the new updated messages, the latter being the old message.

disconnected
~~~~~~~~~~~~

Emitted when the client is disconnected from the Discord server.

error
~~~~~

Emitted when the client runs into a big problem, supplies an error object.

raw
~~~

Emitted when a message over WebSocket is received, it supplies one `object` containing the raw data from the WebSocket.

serverCreated
~~~~~~~~~~~~~

Emitted when a server is joined by the Client, supplies a Server_ object.

serverDeleted
~~~~~~~~~~~~~

Emitted when the client leaves a server, supplies a Server_ object.

serverUpdated
~~~~~~~~~~~~~

Emitted when a server is updated (e.g. name change). Supplies two Server_ objects, the first being the server before the update, the second being the new, updated server.

channelCreated
~~~~~~~~~~~~~~

Emitted when a channel is created, supplies a Channel_ object (includes PM chats as well as server channels).

channelDeleted
~~~~~~~~~~~~~~

Emitted when a channel is deleted, supplies a Channel_ object.

channelUpdated
~~~~~~~~~~~~~~

Emitted when a channel is updated (e.g. name/topic change). Supplies a Channel_ object.

serverRoleCreated
~~~~~~~~~~~~~~~~~

Emitted when a role is created in a server, supplies a Role_ object.

serverRoleDeleted
~~~~~~~~~~~~~~~~~

Emitted when a role is deleted from a server, supplies a Role_ object.

serverRoleUpdated
~~~~~~~~~~~~~~~~~

Emitted when a role is updated in a server, supplies two Role_ objects. The first is the old role, the second is the updated role.

serverNewMember
~~~~~~~~~~~~~~~

Emitted when a user joins a server, supplies a Server_ object and a User_ object.

serverMemberRemoved
~~~~~~~~~~~~~~~~~~~

Emitted when a member is removed from a server. Supplies a Server_ object and a User_ object.

serverMemberUpdated
~~~~~~~~~~~~~~~~~~~

Emitted when a member in a server is updated. Supplies a Server_ object and a User_ object.

presence
~~~~~~~~

Emitted when a user goes online/offline/idle or starts/stops playing a game. Supplies 3 parameters, the first being the User_ object, the second being the status, the third being the game ID they are playing.

userUpdated
~~~~~~~~~~~

Emitted when a user changes their name, avatar or similar. Supplies two User_ objects, the first being the user before being updated, the second being the updated user.

userTypingStarted
~~~~~~~~~~~~~~~

Emitted when a user starts typing in a channel. Supplies two parameters, a User_ object and a Channel_ object.

userTypingStopped
~~~~~~~~~~~~~~

Emitted when a user stop typing in a channel. Supplies two parameters, a User_ object and a Channel_ object.

userBanned
~~~~~~~~~~

Emitted when a user is banned from a server. Supplies two parameters, a User_ object and a Server_ object.

userUnbanned
~~~~~~~~~~

Emitted when a user is unbanned from a server. Supplies two parameters, a User_ object and a Server_ object.
