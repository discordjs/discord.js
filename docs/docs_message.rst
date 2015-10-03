.. include:: ./vars.rst

Message Documentation
=====================

The Message Class is used to represent data about a Message.

Attributes
----------

tts
~~~

A `Boolean` that is ``true`` if the sent message was text-to-speech, otherwise ``false``.

timestamp
~~~~~~~~~

A `unix timestamp` as a `Number` representing when the message was sent.

mentions
~~~~~~~~

An `Array` of User_ objects that represent the users mentioned in the message.

everyoneMentioned
~~~~~~~~~~~~~~~~~

A `Boolean` that is ``true`` if **@everyone** was used, otherwise ``false``.

id
~~

A `String` UUID of the message, will never change.

.. note:: Currently, message IDs are totally unique. However, in the future they may only be unique within a channel. Make sure to check periodically whether this has changed.

embeds
~~~~~~

A raw, unhandled `JSON object` that will contain embeds of the message - if any.

editedTimestamp
~~~~~~~~~~~~~~~

A `unix timestamp` as a `Number` that is when the message was last edited.

content
~~~~~~~

The actual content of the message as a `String`.

channel
~~~~~~~

The Channel_ that the message was sent in.

author
~~~~~~

**Aliases** : `sender`

The User_ that sent the message.

attachments
~~~~~~~~~~~

A raw, unhandled `JSON object` that will contain attachments of the message - if any.

isPrivate
~~~~~~~~~

A `Boolean` that is ``true`` if the message was sent in a PM / DM chat, or if it was sent in a group chat it will be ``false``.

Functions
---------

isMentioned(user)
~~~~~~~~~~~~~~~~~

A `Boolean` that will return ``true`` if the specified user was mentioned in the message. If everyone is mentioned, this will be false - this function checks specifically for if they were mentioned.


- **user** - The User_ that you want to see is mentioned or not.