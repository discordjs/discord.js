.. include:: ./vars.rst

User Documentation
==================

The User Class is used to represent data about users.

Attributes
----------

username
~~~~~~~~

A `String` that is the username of the user.

discriminator
~~~~~~~~~~~~~

Used to differentiate users with the same username, provided by Discord. If you want to differentiate users, we'd recommend using the `id` attribute.

id
~~

A `String` UUID of the user, will never change.

avatar
~~~~~~

A `String` that is the user's avatar's ID, or if they don't have one this is `null`.

avatarURL
~~~~~~~~~

A `String` that points to the user's avatar's URL, or if they don't have an avatar this is `null`.

status
~~~~~~

The status of the user as a `String`; offline/online/idle.

-----

Functions
---------

mention()
~~~~~~~~~

Returns a `String`. This function will generate the mention string for the user, which when sent will preview as a mention. E.g:

.. code-block:: js

	user.mention(); // something like <@3245982345035>
	
This is mainly used internally by the API to correct mentions when sending messages, however you can use it.

.. note:: You can also just concatenate a User object with strings to get the mention code, as the `toString()` method points to this. This is useful when sending messages.

equals(object)
~~~~~~~~~~~~~~

Returns a `Boolean` depending on whether the User's ID (``user.id``) equals the object's ID (``object.id``). You should **always**, always use this if you want to compare users. **NEVER** do ``user1 == user2``.

equalsStrict(object)
~~~~~~~~~~~~~~~~~~~~

Sees if the supplied object has the same username, ID, avatar and discriminator of the user. Mainly used internally. Returns a `Boolean` depending on the result.
