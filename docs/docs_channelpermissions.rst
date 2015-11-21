.. include:: ./vars.rst

ChannelPermissions
==================

ChannelPermissions is used to represent the final permissions of a user in a channel, to see exactly what they are and aren't allowed to do.

**Examples:**

.. code-block:: js

	var user_permissions = channel.permissionsOf(user);
	
	var can_mention_everyone = user_permissions.hasPermission("mentionEveryone");

--------

Functions
---------

serialize()
~~~~~~~~~~~

**Aliases:** `serialise`

Returns an object containing permission names and values. E.g:

.. code-block:: js

	{
		createInstantInvite : true,
		kickMembers : false
	}

For more on valid permission names, see `Permission Constants`_.

hasPermission(permission)
~~~~~~~~~~~~~~~~~~~~~~~~~

Sees whether the user has the permission given.

- **permission** - See `Permission Constants`_ for valid permission names.