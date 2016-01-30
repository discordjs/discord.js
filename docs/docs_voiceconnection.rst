.. include:: ./vars.rst

VoiceConnection
===============

**Warning! Still experimental!**

As of discord.js v5.0.0, voice support has been added. This means you can stream audio but not yet receive.

--------

Attributes
----------

voiceChannel
~~~~~~~~~~~~

VoiceChannel_ that the connection is for

client
~~~~~~

Client_ the connection belongs to

token
~~~~~

The token used to authenticate with Discord

server
~~~~~~

The Server_ on which the voice connection takes place

encoder
~~~~~~~

The AudioEncoder_ used to encode data in this particular session

playingIntent
~~~~~~~~~~~~~

A StreamIntent_ used to bind events to the voice connection

playing
~~~~~~~

Whether or not the bot is currently playing something

streamTime
~~~~~~~~~~

The amount of time the current track has been playing for, in milliseconds

more docs coming soon :O
