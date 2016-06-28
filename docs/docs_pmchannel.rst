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

--------

Functions
---------

toString()
~~~~~~~~~~

Returns a mention of the recipient.

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
| **See** client.stopTyping_

getLogs(`limit`, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.getChannelLogs(channel, limit, options, callback)``
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