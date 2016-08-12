.. include:: ./vars.rst

Client
======

**extends** EventEmitter_

This page contains documentation on the `Discord.Client` class. This should be used when you want to start creating things with the API.

--------

Parameters
----------

Client takes an options object, and supports the following options:.

autoReconnect
~~~~~~~~~~~~~

Have discord.js autoreconnect when connection is lost. This is enabled by default.

compress
~~~~~~~~

Have Discord send a compressed READY packet.

forceFetchUsers
~~~~~~~~~~~~~~~

Make the library get all the users in all guilds, and delay the ready event until all users are received. This will slow down ready times and increase initial network traffic.

guildCreateTimeout
~~~~~~~~~~~~~~~

How long in milliseconds to wait for more guilds during the initial ready stream. Default is 1000ms. Increase this number if you are getting some serverCreated events right after ready.

largeThreshold
~~~~~~~~~~~~~~

Set a custom large_threshold (the max number of offline members Discord sends in the initial GUILD_CREATE). The maximum is 250.

maxCachedMessages
~~~~~~~~~~~~~~~~~

The maximum number of messages to cache per channel. Decreasing this leads to more missing messageUpdated/messageDeleted events, increasing this leads to more RAM usage, especially over time.

rateLimitAsError
~~~~~~~~~~~~~~~~

Have the lib throw a rejection Promise/callback when being ratelimited, instead of auto-retrying.

disableEveryone
~~~~~~~~~~~~~~~~

Have the lib insert a zero width space between here and everyone mentions disabling them.

shardCount
~~~~~~~~~~

The total number of shards.

shardId
~~~~~~~

A zero-based integer representing the value of the current shard.

bot
~~~~~~~

Boolean. Use 'Bot my_token' when authorizing. Default is true, should be false if user bot.

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

unavailableServers
~~~~~~~~~~~~~~~~~~

A Cache_ of Server_ objects that the client has cached that are unavailable.

voiceConnections
~~~~~~~~~~~~~~~~

A Cache_ of VoiceConnection_ objects that the client is in.

voiceConnection
~~~~~~~~~~~~~~~

Returns a VoiceConnection_ object, is an alias to voiceConnections[0].

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

loginWithToken(token, email, password, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Logs the client in, using just a token. The specified email and password are optional - they're only needed when using
`updateDetails` which requires them for authentication.

- **token** - A valid Discord authentication token used to log in, `String`
- **email** - (Optional) The e-mail used for later authentication, `String`.
- **password** - (Optional) The password used for later authentication, `String`.
- **callback** - `function` that takes the following parameters:
    - **error** - An error if any occurred
    - **token** - A `String` containing the specified token. This is only used for compatibility with `login`, this token will always be identical to the specified one.

logout(`callback`)
~~~~~~~~~~~~~~~~~~

Logs the client out and closes the WebSocket connections.

- **callback** - `function` that takes the following parameter:
    - **error** - An error if any occurred

destroy(`callback`)
~~~~~~~~~~~~~~~~~~~

Similar to logout but should be used if you're not going to create the Client again later in your program.

- **callback** - `function` that takes the following parameter:
    - **error** - An error if any occurred

sendMessage(channel, content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends a message to the specified channel.

- **channel** - a `Channel Resolvable`_ or `User Resolvable`_
- **content** - (Optional if file is passed in options) a `String Resolvable`_ - the message you want to send
- **options** - (Optional) `object` containing:
    - **tts** - (Optional) `Boolean`, should message be text-to-speech
    - **disableEveryone** - (Optional) `Boolean`, disable `here` and `everyone` mentions
    - **file** - (Optional) `object`, containing:
        - **file** - a `File Resolvable`_
        - **name** - (Optional) `String`, filename to upload file as
- **callback** - `function` that takes the following parameters:
    - **error** - error object if any occurred
    - **message** - the sent Message_

sendTTSMessage(channel, content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

An alias for `sendMessage(channel, content, {tts: true}, callback)`

sendFile(channel, attachment, name, content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends a file to the specified channel.

- **channel** - a `Channel Resolvable`_ or `User Resolvable`_
- **attachment** - A `File Resolvable`_
- **name** - (Optional) `String`, filename to upload file as
- **content** - (Optional) `String`, text message to send with the attachment
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

replyTTS(message, content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

An alias for `reply(message, content, {tts: true}, callback)`

awaitResponse(message, `prompt`, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Wait for a response from the same user in the same channel as an existing message.

- **message** - The original Message_
- **prompt** - a `String Resolvable`_ - a message you want to send to prompt the user
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

- **message** - The `Message Resolvable`_ to delete
- **options** - `object` containing the following:
    - **wait** - Milliseconds as a `number` to wait before deleting the message
- **callback** - `function` that takes the following parameters:
    - **error** - error object if any occurred

deleteMessages(messages, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Attempts to bulk delete messages from the same channel

- **message** - Array of `Message Resolvable`_ to delete
- **callback** - `function` that takes the following parameters:
    - **error** - error object if any occurred

getChannelLogs(channel, `limit`, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a list of previously sent messages in a channel.

- **channel** - A `Channel Resolvable`_ to get messages from
- **limit** - The maximum amount of messages to retrieve - defaults to 50. A `Number`
- **options** - An `object` containing either of the following:
    - **before** - A `Message Resolvable`_ - gets messages before this message.
    - **after** - A `Message Resolvable`_ - gets messages after this message.
    - **around** - A `Message Resolvable`_ - gets the messages around this message.
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **messages** - `array` of Message_ objects sent in channel

getMessage(channel, messageID, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a message. This also works for messages that aren't cached but will only work for OAuth bot accounts.

- **channel** - The Channel_ to get the message from.
- **messageID** - The message id to get the message object from. A `String`
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **message** - The `Message`_

pinMessage(message, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Pins a message to a channel.

- **message** - The Message_ to pin.
- **callback** - `function` taking the following:
    - **error** - error if any occurred

unpinMessage(message, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Unpins a message from a channel.

- **message** - The Message_ to unpin.
- **callback** - `function` taking the following:
    - **error** - error if any occurred

getPinnedMessages(channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a list of all pinned messages in a channel.

- **channel** - The Channel_ to get pins from
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **messages** - `array` of Message_ objects that are pinned.

getBans(server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets a list of banned users in a server.

- **server** - `Server Resolvable`_ - The server to get banned users of
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **users** - `array` of banned users in the server

joinServer(invite, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Joins a server from the given invite. This will not work for OAuth bot accounts, you must use `OAuth invite URLs <https://discordapp.com/developers/docs/topics/oauth2#adding-bots-to-guilds>`_ instead.

- **invite** - an `Invite Resolvable`_
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **server** - the joined Server_

createServer(name, region, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a server

- **name** - `String`, name of the server
- **region** - `String`, region of the server, currently **us-west, us-east, us-south, us-central, singapore, london, sydney, frankfurt** or **amsterdam**
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **server** - the created Server_

updateServer(server, options, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Updates the information, such as name or region, of a server the client is in

- **server** - a `Server Resolvable`_
- **options** - `object` containing (all optional):
    - **name** - `String`, name of the server
    - **region** - `String`, region of the server, currently **us-west, us-east, us-south, us-central, singapore, london, sydney, frankfurt** or **amsterdam**
    - **ownerID** - a `User Resolvable`_, user to transfer the server to (must be owner)
    - **icon** - a `Base64 Resolvable`_
    - **splash** - a `Base64 Resolvable`_ (VIP only)
    - **verificationLevel** - `Number`, a verification level (0, 1, 2, 3)
    - **afkChannelID** - a `Channel Resolvable`_, the AFK voice channel
    - **afkTimeout** - `Number`, AFK timeout in seconds
- **callback** - `function` taking the following:
    - **error** - error if any occurred

deleteServer(server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deletes a server that the client is in

- **server** - a `Server Resolvable`_
- **callback** - `function` taking the following:
    - **error** - error if any occurred

leaveServer(server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Leaves a server that the client is in

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

moveMember(user, channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Moves a user from one voice channel into another.

- **user** - A `User Resolvable`_ that should be moved
- **channel** - The `Channel Resolvable`_ to move the user to
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

getInvite(invite, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets more info on a specific invite

- **invite** - An `Invite Resolvable`_
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **invite** - an Invite_ object

getInvites(source, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets all the invites in a channel/server

- **source** - A `Channel Resolvable`_ or `Server Resolvable`_
- **callback** - `function` taking the following:
    - **error** - error if any occurred
    - **invite** - Array of Invite_ objects

deleteInvite(invite, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deletes an invite

- **invite** - An `Invite Resolvable`_
- **callback** - a `function` taking the following:
    - **error** - error if any occurred

setStatus(status, `game`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the Discord Status of the Client

- **status** - `String`, either ``online, here, active, available`` or ``idle, away``
- **game** - `String`, Name of game being played, or `Object` with the properties `name` `url` `type`, or `null` to clear
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

setPlayingGame(game, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the Discord Status of the Client

- **game** - `String`, Name of game being played, or `null` to clear
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setStreaming(name, url, type, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the Discord Status of the Client

- **name** - `String`, Name of game being played
- **url** - `String`, URL that it will link to, only supports `twitch.tv` urls at this time.
- **type** - `Number`, `1` indicates streaming
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setChannelTopic(channel, topic, `callback`)
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

setChannelUserLimit(channel, limit, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the user limit of a voice channel

- **channel** - A `Channel Resolvable`_
- **limit** - A `Number`, user limit (0 - 99)
- **callback** - `function` taking the following:
    - **error** - error if any occurred

setChannelBitrate(channel, bitrate, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the bitrate of a voice channel

- **channel** - A `Channel Resolvable`_
- **bitrate** - A `Number`, bitrate (in kb/s) (8 - 96)
- **callback** - `function` taking the following:
    - **error** - error if any occurred

updateChannel(channel, data, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Updates the settings of a channel

- **channel** - A `Channel Resolvable`_
- **details** - `object` containing any of the following:
    - **name** - `String`, the new name of channel
    - **topic** - `String`, the new topic of the channel (`TextChannel`_ only)
    - **position** - `Number`, the new position of the channel
    - **userLimit** - `Number`, the new user limit of the channel (`VoiceChannel`_ only)
    - **bitrate** - `Number`, the new bitrate (in kb/s) of the channel (`VoiceChannel`_ only)
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

Joins a Voice Channel to begin transmitting audio. If you have an OAuth bot account, you can connect to multiple voice channels at once, but only one per guild.

- **channel** - A `VoiceChannel Resolvable`_
- **callback** - `function` that takes the following:
    - **error** - error if any occurred
    - **connection** - VoiceConnection_, the created Voice Connection.

leaveVoiceChannel(channel, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Leaves the specified Voice Channel if connected

- **channel** - A `VoiceChannel Resolvable`_
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
        ],
        mentionable: false
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
        ],
        mentionable: false
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
- **role** - A `Role Resolvable`_ or an array of `Role Resolvable`_
- **callback** - `function` that takes the following:
    - **error** - error if any occurred

memberHasRole(member, role)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Aliases** : `userHasRole`

Returns if a user has a role

- **member** - A `User Resolvable`_
- **role** - A `Role Resolvable`_ or an array of `Role Resolvable`_

removeMemberFromRole(member, role, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Aliases** : `removeUserFromRole`

Removes a member of a server from a role in the server

- **member** - A `User Resolvable`_
- **role** - A `Role Resolvable`_ or an array of `Role Resolvable`_
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

muteMember(user, server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Server-mutes a member.

- **user** - A `User Resolvable`_ to mute
- **server** - A `Server Resolvable`_ to mute the user in
- **callback** - `function` taking the following:
    - **error** - error if any occurred.

unmuteMember(user, server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Server-unmutes a member.

- **user** - A `User Resolvable`_ to unmute
- **server** - A `Server Resolvable`_ to unmute the user in
- **callback** - `function` taking the following:
    - **error** - error if any occurred.

deafenMember(user, server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Server-deafens a member.

- **user** - A `User Resolvable`_ to deafen
- **server** - A `Server Resolvable`_ to deafen the user in
- **callback** - `function` taking the following:
    - **error** - error if any occurred.

undeafenMember(user, server, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Server-undeafens a member.

- **user** - A `User Resolvable`_ to undeafen
- **server** - A `Server Resolvable`_ to undeafen the user in
- **callback** - `function` taking the following:
    - **error** - error if any occurred.

setNickname(server, nickname, `user`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Set the nickname of a user on a server.

- **server** - A `Server Resolvable`_ to set the nickname of the user in
- **nickname** - `string` of the nickname
- **user** - The `User Resolvable`_ to perform the nickname change on. If no user is specified, this will change the bot user's nickname
- **callback** - `function` taking the following:
    - **error** - error if any occurred.

setNote(user, note, `callback`)
~~~~~~~~~~~~~~~~~~~~

Set the note of a user. This will only work for user accounts.

- **user** - A `User Resolvable`_ to which the note is applied.
- **note** - `String`, content of the note, or `null` to clear.
- **callback** - `function` taking the following:
    - **error** - error if any occurred.

getOAuthApplication(appID, `callback`)
~~~~~~~~~~~~~~~~~~~~

Get data on an OAuth2 application

- **appID** - The target application ID. If none was specified, it defaults to "@me", which refers to the logged in user's application.
- **callback** - `function` taking the following:
    - **error** - error if any occurred.
    - **data** - the application data. Refer to `the official Discord API documentation entry <https://discordapp.com/developers/docs/topics/oauth2#get-current-application-information>`_ for data structure details

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

Emitted when a message has been updated and the client finds out. Supplies two Message_ objects, the first being the message before the update, the second being the new, updated message.

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

Emitted when a channel is updated (e.g. name/topic change). Supplies two Channel_ objects, the first being the channel before the update, the second being the new, updated channel.

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

Emitted when a member in a server is updated. Supplies a Server_ object and 2 User_ objects, the first being the new, updated user, the second being the old one. The old user object could be null if the bot didn't previously have the member cached.

presence
~~~~~~~~

Emitted when a user goes online/offline/idle, starts/stops playing a game, or changes their username/avatar/similar. Supplies 2 User_ objects, the first being the old user, the second being the new, updated user.

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

noteUpdated
~~~~~~~~~~~

Emitted when a note is updated. Supplies a User_ object (containing the updated note) and the old note.

voiceJoin
~~~~~~~~

Emitted when a user joins a voice channel, supplies a VoiceChannel_ and a User_.

voiceSwitch
~~~~~~~~~~~

Emitted when a user switches voice channels, supplies the old VoiceChannel_, the new VoiceChannel_, and a User_.

voiceLeave
~~~~~~~~~~

Emitted when a user leaves a voice channel, supplies a VoiceChannel_ and a User_.

voiceStateUpdate
~~~~~~~~~~

Emitted when a user mutes/deafens, supplies a VoiceChannel_, User_, an object containing the old mute/selfMute/deaf/selfDeaf properties, and an object containing the new mute/selfMute/deaf/selfDeaf properties.

voiceSpeaking
~~~~~~~~~~~

Emitted when a user starts or stops speaking, supplies a VoiceChannel_, and User_. The `speaking` property under the supplied User_ object can be used to determine whether the user started or stopped speaking.