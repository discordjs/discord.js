.. include:: ./vars.rst

Server Documentation
==================

The Server Class is used to represent data about a server.

Attributes
----------

client
~~~~~~

The Discord Client_ that the Server was cached by.

region
~~~~~~

The region that the server is in, a `String`.

name
~~~~

The server's name, as a `String`.

id
~~

The server's id, as a `String`.

members
~~~~~~~

**Aliases** : `users`

The members in a server, an `Array` of User_ objects.

channels
~~~~~~~~

The channels in a server, an `Array` of Channel_ objects.

icon
~~~~

The icon ID of the server if it has one as a `String`, otherwise it is `null`.

iconURL
~~~~~~~

A `String` that is the URL of the server icon if it has one, otherwise it is `null`.

afkTimeout
~~~~~~~~~~

A `Number` that is the AFK Timeout of the Server.

afkChannel
~~~~~~~~~~

A Channel_ that represents the AFK Channel of the server if it has one, otherwise it is `null`.

defaultChannel
~~~~~~~~~~~~~~

The **#general** Channel_ of the server.

owner
~~~~~

A User_ object representing the user that owns the server.

-----

Functions
---------

.. note:: When concatenated with a String, the object will become the server's name, e.g. ``"this is " + server`` would be ``this is Discord API`` if the server was called `Discord API`.

getChannel(key, value)
~~~~~~~~~~~~~~~~~~~~~~

Gets a Channel_ that matches the specified criteria. E.g:

.. code-block:: js

    server.getChannel("id", 1243987349) // returns a Channel where channel.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value

getMember(key, value)
~~~~~~~~~~~~~~~~~~~~~

Gets a User_ that matches the specified criteria. E.g:

.. code-block:: js

    bot.getUser("id", 1243987349) // returns a user where user.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value

equals(object)
~~~~~~~~~~~~~~

Returns a `Boolean` depending on whether the Server's ID (``server.id``) equals the object's ID (``object.id``). You should **always**, always use this if you want to compare servers. **NEVER** do ``server1 == server2``.
