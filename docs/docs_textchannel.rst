.. include:: ./vars.rst

TextChannel
===========

**extends** ServerChannel_

A text channel of a server.

--------

Attributes
----------

topic
~~~~~

The topic of the channel, a `String`.

lastMessage
~~~~~~~~~~~

Last Message_ sent in the channel. May be null if no messages sent whilst the Client was online.

messages
~~~~~~~~

A Cache_ of Message_ objects.