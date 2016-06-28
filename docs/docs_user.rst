.. include:: ./vars.rst

User
====

**extends** Equality_

Stores information about users.

--------

Attributes
----------

client
~~~~~~

The Client_ that created the user.

username
~~~~~~~~

_Alias_ : ``name``

`String`, username of the User.

discriminator
~~~~~~~~~~~~~

`Integer` from 0-9999, don't use this to identify users. Used to separate the user from the 9998 others that may have the same username. Made redundant by ``user.id``.

id
~~

`String` (do not parse to an Integer, will become inaccurate). The ID of a user, never changes.

avatar
~~~~~~

`String`, the ID/hash of a user's avatar. To get a path to their avatar, see ``user.avatarURL``.

status
~~~~~~

The status of a user, `String`. Either ``online``, ``offline`` or ``idle``.

game
~~~~

The game object of a user. `null` if not playing a game, otherwise `Object` containing the following values:

.. code-block:: js

	{
		name : 'Game Name' //Name of game user is playing
	}

typing
~~~~~~

`Object` containing the following values:

.. code-block:: js

	{
		since : 1448038288519, //timestamp of when
		channel : <Channel Object> // channel they are typing in.
	}

avatarURL
~~~~~~~~~

A valid URL to the user's avatar if they have one, otherwise null.

bot
~~~

A boolean that represents if the user is an official OAuth bot account or not.

voiceChannel
~~~~~~~~~~~~

The VoiceChannel_ the user is connected to. If they aren't in any voice channels, this will be ``null``.

createdAt
~~~~~~~~~

A `Date` referring to when the user was created.

note
~~~~

The note of the user, `String`.

speaking
~~~~~~~~

A boolean that represents whether or not the user is speaking in a voice channel, default is `false`.

Functions
---------

mention()
~~~~~~~~~

Returns a valid string that can be sent in a message to mention the user. By default, ``user.toString()`` does this so by adding a user object to a string, e.g. ``user + ""``, their mention code will be retrieved.

sendMessage(content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.sendMessage(channel, content, options, callback)``
| **Aliases** `send`
| **See** client.sendMessage_

sendTTSMessage(content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.sendTTSMessage(channel, content, callback)``
| **Aliases** `sendTTS`
| **See** client.sendTTSMessage_

sendFile(attachment, name, content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.sendFile(channel, attachment, name, content, callbasck)``
| **See** client.sendFile_

startTyping(`callback`)
~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.startTyping(channel, callback)``
| **See** client.startTyping_

stopTyping(`callback`)
~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.stopTyping(channel, callback)``
| **See** client.stopTyping_

addTo(role, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.addMemberToRole(member, role, callback)``
| **See** client.addMemberToRole_

removeFrom(role, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.removeMemberFromRole(member, role, callback)``
| **See** client.removeMemberFromRole_

getLogs(`limit`, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.getChannelLogs(channel, limit, options, callback)``
| **See** client.getChannelLogs_

getMessage(messageID, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.getMessage(channel, messageID, callback)``
| **See** client.getMessage_

hasRole(role)
~~~~~~~~~~~~

| **Shortcut of** ``client.memberHasRole(member, role)``
| **See** client.memberHasRole_


.. _client.addMemberToRole : ./docs_client.html#addmembertorole-member-role-callback
.. _client.removeMemberFromRole : ./docs_client.html#removememberfromrole-member-role-callback
.. _client.memberHasRole : ./docs_client.html#memberhasrole-member-role
.. _client.sendMessage : ./docs_client.html#sendmessage-channel-content-options-callback
.. _client.sendTTSMessage : ./docs_client.html#sendttsmessage-channel-content-callback
.. _client.sendFile : ./docs_client.html#sendfile-channel-attachment-name-content-callback
.. _client.startTyping : ./docs_client.html#starttyping-channel-callback
.. _client.stopTyping : ./docs_client.html#stoptyping-channel-callback
.. _client.getChannelLogs : ./docs_client.html#getchannellogs-channel-limit-options-callback
.. _client.getMessage : ./docs_client.html#getmessage-channel-messageid-callback