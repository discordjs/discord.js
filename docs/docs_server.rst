.. include:: ./vars.rst

Server
======

**extends** Equality_

Stores information about a Discord Server.

--------

Attributes
----------

client
~~~~~~

The Client_ that cached the Server.

region
~~~~~~

`String`, region of the server.

name
~~~~

`String`, name of the server.

id
~~

`String`, ID of the server - never changes.

members
~~~~~~~

Members of the server, a Cache_ of User_ objects.

channels
~~~~~~~~

Channels in the server, a Cache_ of ServerChannel_ objects.

roles
~~~~~

Roles of the server, a Cache_ of Role_ objects.

icon
~~~~

ID/Hash of server icon, use ``server.iconURL`` for an URL to the icon.

afkTimeout
~~~~~~~~~~

`Number`, the AFK timeout in seconds before a user is classed as AFK. If there isn't an AFK timeout, this will be null.

afkChannel
~~~~~~~~~~

The channel where AFK users are moved to, ServerChannel_ object. If one isn't set, this will be null.

defaultChannel
~~~~~~~~~~~~~~

**Aliases** `generalChannel, general`

The ``#general`` ServerChannel_ of the server.

owner
~~~~~

The founder of the server, a User_ object.

iconURL
~~~~~~~

The URL of the Server's icon. If the server doesn't have an icon, this will be null.

Functions
---------

rolesOfUser(user)
~~~~~~~~~~~~~~~~~

**Aliases**: `rolesOf`

Returns an array of the roles affecting a user server-wide.

------

detailsOfUser(user)
~~~~~~~~~~~~~~~~~~~

**Aliases** `detailsOf`

Returns an object containing metadata of a user within the server, containing a structure similar to the following:

.. code-block:: js

	{
		joinedAt : 1449339323747,
		mute : false,
		deaf : false
	}

----------

leave()
~~~~~~~

| **Shortcut of** ``client.leaveServer(server)``
| **Aliases** `delete`
| **See** client.leaveServer_

------

|

createInvite(`options`, `callback`)
~~~~~~~

| **Shortcut of** ``client.createInvite(server, options, callback)``
| **See** client.createInvite_
|

------

createRole(`data`, `callback`)
~~~~~~~

| **Shortcut of** ``client.createRole(server, data, callback)``
| **See** client.createRole_
|

------

createChannel(name, `type`, `callback`)
~~~~~~~

| **Shortcut of** ``client.createChannel(server, name, type, callback)``
| **See** client.createChannel_
|

------

getBans(`callback`)
~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.getBans(server, callback)``
| **See** client.getBans_
|

------

banMember(user, `length`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.banMember(member, server, length, callback)``
| **Aliases** `banUser, ban`
| **See** client.banMember_
|

------

unbanMember(user, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.unbanMember(member, server, callback)``
| **Aliases** `unbanUser, unban`
| **See** client.unbanMember_
|

------

kickMember(user, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.kickMember(member, server, callback)``
| **Aliases** `kickUser, kick`
| **See** client.kickMember_
|

------

.. _client.leaveServer : ./docs_client.html#leaveserver-server-callback
.. _client.createInvite : ./docs_client.html#createinvite-channel-options-callback
.. _client.createRole : ./docs_client.html#createrole-server-data-callback
.. _client.createChannel : ./docs_client.html#createchannel-server-name-type-callback
.. _client.banMember : ./docs_client.html#banmember-user-server-length-callback
.. _client.unbanMember : ./docs_client.html#unbanmember-user-server-callback
.. _client.kickMember : ./docs_client.html#kickmember-user-server-callback
.. _client.getBans : ./docs_client.html#getbans-server-callback