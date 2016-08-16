.. include:: ./vars.rst

Message
=======

**extends** Equality_

A Message object is used to represent the data of a message.

--------

Attributes
----------

channel
~~~~~~~

The channel the message was sent in, either a TextChannel_ or PMChannel_.

server
~~~~~~~

The Server_ the message was sent in. Will be undefined if the message was sent in a PMChannel_.

client
~~~~~~

The Client_ that cached the message.

attachments
~~~~~~~~~~~

A raw array of attachment objects.

tts
~~~

`Boolean`, true if the message was text-to-speech.

embeds
~~~~~~

A raw array of embed objects.

timestamp
~~~~~~~~~

`Number`, timestamp of when the message was sent.

everyoneMentioned
~~~~~~~~~~~~~~~~~

`Boolean`, true if ``@everyone`` was mentioned.

id
~~

`String`, ID of the message.

editedTimestamp
~~~~~~~~~~~~~~~

Timestamp on when the message was last edited, `Number`. Potentially null.

author
~~~~~~

**Alias:** `sender`

The User_ that sent the message.

content
~~~~~~~

`String`, content of the message.

cleanContent
~~~~~~~

`String`, content of the message with valid user mentions (<@123>) replaced with "@username".

mentions
~~~~~~~~

A array of User_ objects that were mentioned in the message.

pinned
~~~~~~

`Boolean`, true if the message is pinned to its channel.

Functions
---------

isMentioned(user)
~~~~~~~~~~~~~~~~~

Returns true if the given user was mentioned in the message.

- **user** - A `User Resolvable`_

toString()
~~~~~~~~~~

Returns the content of the Message.

delete(`options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.deleteMessage(message, options, callback)``
| **See** client.deleteMessage_

update(content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.updateMessage(message, content, options, callback)``
| **Aliases** `edit`
| **See** client.updateMessage_

reply(content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.reply(message, content, options, callback)``
| **See** client.reply_

replyTTS(content, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.replyTTS(message, content, callback)``
| **See** client.replyTTS_

pin(`callback`)
~~~~~~~~~~~~~~~

| **Shortcut of** ``client.pinMessage(message, callback)``
| **See** client.pinMessage_

unpin(`callback`)
~~~~~~~~~~~~~~~~~

| **Shortcut of** ``client.unpinMessage(message, callback)``
| **See** client.unpinMessage_

.. _client.deleteMessage : ./docs_client.html#deletemessage-message-options-callback
.. _client.updateMessage : ./docs_client.html#updatemessage-message-content-options-callback
.. _client.reply : ./docs_client.html#reply-message-content-options-callback
.. _client.replyTTS : ./docs_client.html#replytts-message-content-callback
.. _client.pinMessage : ./docs_client.html#pinmessage-message-callback
.. _client.unpinMessage : ./docs_client.html#unpinmessage-message-callback
