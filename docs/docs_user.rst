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

gameID
~~~~~~

The ID of the game a user is playing, `Number`.

typing
~~~~~~

`Object` containing the following values;

.. code-block:: js

	{
		since : 1448038288519, //timestamp of when
		channel : <Channel Object> // channel they are typing in.
	}

avatarURL
~~~~~~~~~

A valid URL to the user's avatar if they have one, otherwise null.

Functions
---------

mention()
~~~~~~~~~

Returns a valid string that can be sent in a message to mention the user. By default, ``user.toString()`` does this so by adding a user object to a string, e.g. ``user + ""``, their mention code will be retrieved.