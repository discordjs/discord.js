.. include:: ./vars.rst

PMChannel
=========

**extends** Channel_

A PMChannel is a Private/Direct channel between the Client and another user.

--------

Attributes
----------

messages
~~~~~~~~

A Cache_ of Message_ objects.

recipient
~~~~~~~~~

The User_ that is the recipient of the Channel.

lastMessage
~~~~~~~~~~~

The last Message_ sent in the channel, may be null if no messages have been sent during the time the bound Client_ has been online.