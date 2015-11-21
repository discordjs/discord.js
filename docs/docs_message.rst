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

The channel the message sent in, either a TextChannel_ or PMChannel_.

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

mentions
~~~~~~~~

A Cache_ of User_ objects that were mentioned in the message.

Functions
---------

isMentioned(user)
~~~~~~~~~~~~~~~~~

Returns true if the given user was mentioned in the message.

- **user** : A `User Resolvable`_