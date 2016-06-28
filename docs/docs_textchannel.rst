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

.. _client.sendMessage : ./docs_client.html#sendmessage-channel-content-options-callback
.. _client.sendTTSMessage : ./docs_client.html#sendttsmessage-channel-content-callback
.. _client.sendFile : ./docs_client.html#sendfile-channel-attachment-name-content-callback
.. _client.startTyping : ./docs_client.html#starttyping-channel-callback
.. _client.stopTyping : ./docs_client.html#stoptyping-channel-callback
.. _client.getChannelLogs : ./docs_client.html#getchannellogs-channel-limit-options-callback
.. _client.getMessage : ./docs_client.html#getmessage-channel-messageid-callback
.. _client.setChannelTopic : ./docs_client.html#setchanneltopic-channel-topic-callback
.. _client.setChannelNameAndTopic : ./docs_client.html#setchannelnameandtopic-channel-name-topic-callback