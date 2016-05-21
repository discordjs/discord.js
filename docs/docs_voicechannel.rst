.. include:: ./vars.rst

VoiceChannel
============

**extends** ServerChannel_

A voice channel of a server. Currently, the voice channel class has no differences to the ServerChannel class.

--------


Attributes
----------

members
~~~~~~~~

A Cache_ of Users_ that are connected to the voice channel

userLimit
~~~~~~~~

The maximum amount of users that can connect to the voice channel. If it's 0, there is no limit

Functions
---------

setUserLimit(limit, `callback`)
~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.setChannelUserLimit(channel, limit, callback)``
| **See** client.setChannelUserLimit_