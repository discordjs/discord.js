.. include:: ./vars.rst

ServerChannel
=============

**extends** Channel_

A ServerChannel is a Channel_ that belongs to a Server_.

--------

Attributes
----------

name
~~~~

`String`, name of the channel.

type
~~~~

`String`, either ``voice`` or ``text``.

position
~~~~~~~~

`Number`, position in the channel list.

permissionOverwrites
~~~~~~~~~~~~~~~~~~~~

Cache_ of all the PermissionOverwrite_ objects affecting the channel.

server
~~~~~~

Server_ the channel belongs to.

Functions
---------

permissionsOf(user)
~~~~~~~~~~~~~~~~~~~

**Aliases:** permsOf

Returns a ChannelPermissions_ object of a user's permissions in that channel.

mention()
~~~~~~~~~

Returns a `string` that can be used in discord messages to mention a channel. ``serverChannel.toString()` defaults to this.