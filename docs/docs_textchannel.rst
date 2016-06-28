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

--------

Functions
---------

setTopic(topic, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.setChannelTopic(channel, topic, callback)``
| **See** client.setChannelTopic_

setNameAndTopic(name, topic, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.setChannelNameAndTopic(channel, name, topic, callback)``
| **See** client.setChannelNameAndTopic_

sendMessage(content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.sendMessage(channel, content, options, callback)``
| **Aliases** `send`
| **See** client.sendMessage_

sendTTSMessage(content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.sendTTSMessage(channel, content, callback)``
| **Aliases** `sendTTS`
| **See** client.sendTTSMessage_

sendFile(attachment, name, content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.sendFile(channel, attachment, name, content, callbasck)``
| **See** client.sendFile_

startTyping(`callback`)
~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.startTyping(channel, callback)``
| **See** client.startTyping_

stopTyping(`callback`)
~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.stopTyping(channel, callback)``
| **See** client.stopTyping

getLogs(`limit`, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.getChannelLogs(channel, limit, options, callback)
| **See** client.getChannelLogs_

getMessage(messageID, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.getMessage(channel, messageID, callback)``
| **See** client.getMessage_