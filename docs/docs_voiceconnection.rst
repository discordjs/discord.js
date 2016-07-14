.. include:: ./vars.rst

VoiceConnection
===============

discord.js currently supports sending audio data over Discord voice chat. A voice connection can be initiated using
client.joinVoiceChannel_ and then later accessed again using the `client.voiceConnection` property. You can play something
using the `playXYZ` methods and then later stop the playback and listen for events that tell you about the playback status.

Note that discord.js does not support receiving data from voice yet, only sending.

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

paused
~~~~~~

Whether or not the playback is currently paused

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

The `options` object can be used to control playback properties, currently, it allows setting the seek (in seconds) using the `seek` property, and the volume using the `volume` property, which can be in any of the following formats:

 - A number representing the linear change in volume; 1 is equal to no change, 0 is completely silent, 0.5 is half the regular volume and 2 is double the regular volume.
 - A string representing the linear change in volume, if this is more convenient for you.
 - A string representing decibel gain, where `"0dB"` is no change, `"-3dB"` is half the volume (in linear units), `"+6dB"` is four times the volume (in linear units) and so on.

It is recommended to change the volume, because the default of 1 is usually too loud. (A reasonable setting is `0.25` or `"-6dB"`).

The callback will be called immediately after playback has *started*, it will have an error object and the stream intent as its parameters. The callback will only receive
an error if the encoding fails, for playback errors, you can bind a function to the `error` event of the intent. The intent supports the following events:

 - The `time` event is emitted every packet (20 milliseconds) and has the current playback time in milliseconds as its only parameter. The playback time can also be checked at any time using the `streamTime` attribute.
 - The `end` event is emitted once playback ends. Depending on various factors, it may be emitted a couple seconds earlier than the actual stream ending, you may have to add an offset if necessary.
 - The `error` event is emitted if an error happens during playback, such as failing to send a packet.

The intent can later be accessed again using the `playingIntent` property. If you prefer _Promises over callbacks, this method will return a promise you can use in the same way as the callback.

playRawStream(stream, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This method is used in much the same way as `playFile`, except it plays data back from a stream containing audio data instead of a file or URL.

| See voiceConnection.playFile_ for usage information.

playArbitraryFFmpeg(ffmpegOptions, `volume`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This method can be used to play data obtained from an arbitrary call to ffmpeg. Note that the array of options given as the parameter will
still be concatenated with the following options so it can be used with Discord:

.. code::

    -loglevel 0
    -f s16le
    -ar 48000
    -ac 2
    pipe:1

setSpeaking(value)
~~~~~~~~~~~~~~~~~~

Sets whether or not the user is speaking (green circle around user on the official client). discord.js does this automatically when playing something,
but you may want to spoof it or manually disable it.

 - **value** - `true` or `false`: whether or not you want the bot to show as speaking

setVolume(volume)
~~~~~~~~~~~~~

Sets the current volume of the connecion. 1.0 is normal, 0.5 is half as loud, 2.0 is twice as loud.

getVolume()
~~~~~~~~~~~~~

Returns the current volume. 1.0 is normal, 0.5 is half as loud, 2.0 is twice as loud.

pause()
~~~~~~~

Pauses the current connection's audio.

resume()
~~~~~~~~

Resumes the current connection's audio.

stopPlaying()
~~~~~~~~~~~~~

Stops the current playback immediately. After this method has finished, it is safe to play something else.

destroy()
~~~~~~~~~

Disconnects from the voice server and destroys all network connection. It's impossible to play anything on this connection afterwards, you will have to re-initiate
a connection using client.joinVoiceChannel_. This method also calls `stopPlaying` internally, you don't have to do that yourself.

.. _Format list: https://ffmpeg.org/general.html#File-Formats
.. _voiceConnection.playFile: ./docs_voiceconnection.html#playfile-path-options-callback
.. _client.joinVoiceChannel: ./docs_client.html#joinvoicechannel-channel-callback
