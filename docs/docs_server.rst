.. include:: ./vars.rst

Server
======

Stores information about a Discord Server.

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

`Number`, the AFK timeout in seconds before a user is classed as AFK.

afkChannel
~~~~~~~~~~

The channel where AFK users are moved to, ServerChannel_ object.