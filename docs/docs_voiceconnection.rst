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

A stream intent used to bind events to the voice connection

playing
~~~~~~~

Whether or not the bot is currently playing something

streamTime
~~~~~~~~~~

The amount of time the current track has been playing for, in milliseconds

Functions
---------

playFile(path, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Plays a file to the voice channel. The file can be in practically any format; if you're looking for a list, look here: `Format list`_.
In addition to a file path local to your computer, it can also accept a URL, however this is not recommended as the entire content of the URL will be read before any playback starts.
This can cause delays from seconds to minutes - you can use `playRawStream` with a Stream obtained from the URL instead.

The `options` object can be used to control playback properties, currently, it only allows setting the volume using the `volume` property, which can be in any of the following formats:

 - A number representing the linear change in volume; 1 is equal to no change, 0 is completely silent, 0.5 is half the regular volume and 2 is double the regular volume.
 - A string representing the linear change in volume, if this is more convenient for you.
 - A string representing decibel gain, where `"0dB"` is no change, `"-3dB"` is half the volume (in linear units), `"+6dB"` is four times the volume (in linear units) and so on.

It is recommended to change the volume, because the default of 1 is usually too loud. (A reasonable setting is `0.25` or `"-6dB"`).

The callback will be called immediately after playback has *started*, it will have an error object and the stream intent as its parameters. The callback will only receive
an error if the encoding fails, for playback errors, you can bind a function to the `error` event of the intent. The intent supports the following events:

 - The `time` event is emitted every packet (20 milliseconds) and has the current playback time in milliseconds as its only parameter. The playback time can also be checked at any time using the `streamTime` attribute.
 - The `end` event is emitted once playback ends. Depending on various factors, it may be emitted a couple seconds earlier than the actual stream ending, you may have to add an offset if necessary.
 - The `error` event is emitted if an error happens during playback, such as failing to send a packet.

If you prefer _Promises over callbacks, this method will return a promise you can use in the same way as the callback.

:: _Format list : https://ffmpeg.org/general.html#File-Formats
