.. include:: ./vars.rst

Channel Documentation
=====================

The Channel Class is used to represent data about a Channel.

Attributes
----------

client
~~~~~~

The Discord Client_ that cached the channel

server
~~~~~~

The Server_ that the channel belongs to

name
~~~~

The channel's name, as a `String`.

id
~~

The channel's id, as a `String`.

type
~~~~

The type of the channel as a `String`, either ``text`` or ``voice``.

topic
~~~~~

A `String` that is the topic of the channel, if the channel doesn't have a topic this will be `null`.

messages
~~~~~~~~

An `Array` of Message_ objects received from the channel. There are up to a 1000 messages here, and the older messages will be deleted if necessary.

members
~~~~~~~

**Aliases** : `users`

The members in the channel's server, an `Array` of User_ objects.

-----

Functions
---------

.. note:: When concatenated with a String, the object will become the channel's embed code, e.g. ``"this is " + channel`` would be ``this is <#channelid>``

getMessage(key, value)
~~~~~~~~~~~~~~~~~~~~~~

Gets a Message_ from the channel that matches the specified criteria. E.g:

.. code-block:: js

    channel.getMessage("id", 1243987349) // returns a Message where message.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value

equals(object)
~~~~~~~~~~~~~~

Returns a `Boolean` depending on whether the Channel's ID (``channel.id``) equals the object's ID (``object.id``). You should **always**, always use this if you want to compare channels. **NEVER** do ``channel1 == channel2``.
