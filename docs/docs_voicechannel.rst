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

bitrate
~~~~~~~~

The bitrate of the voice channel (in kb/s).

Functions
---------

setUserLimit(limit, `callback`)
~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.setChannelUserLimit(channel, limit, callback)``
| **See** client.setChannelUserLimit_

setBitrate(kbitrate, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.setChannelBitrate(channel, kbitrate, callback)``
| **See** client.setChannelBitrate_

join(`callback`)
~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.joinVoiceChannel(channel, callback)``
| **See** client.joinVoiceChannel_

.. _client.setChannelUserLimit : ./docs_client.html#setchanneluserlimit-channel-limit-callback
.. _client.setChannelBitrate : ./docs_client.html#setchannelbitrate-channel-bitrate-callback
.. _client.getBans : ./docs_client.html#joinvoicechannel-channel-callback