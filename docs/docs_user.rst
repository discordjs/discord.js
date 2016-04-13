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

Functions
---------

mention()
~~~~~~~~~

Returns a valid string that can be sent in a message to mention the user. By default, ``user.toString()`` does this so by adding a user object to a string, e.g. ``user + ""``, their mention code will be retrieved.