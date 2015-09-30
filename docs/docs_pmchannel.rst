.. include:: ./vars.rst

PMChannel Documentation
=======================

The PMChannel Class is used to represent data about a Private Message Channel.

.. note:: Beware! The PMChannel class does `not` extend the Channel_ class.

Attributes
----------

user
~~~~

The recipient User_ of the PM Channel.

id
~~

`String` UUID of the PM Channel.

messages
~~~~~~~~

An `Array` of Message_ objects. Contains all the cached messages sent in this channel up to a limit of 1000. If the limit is reached, the oldest message is removed first to make space for it.

Functions
---------

getMessage(key, value)
~~~~~~~~~~~~~~~~~~~~~~

Gets a Message_ from the PM Channel that matches the specified criteria. E.g:

.. code-block:: js

    pmchannel.getMessage("id", 1243987349) // returns a Message where message.id === 1243987349
    
- **key** - a `String` that is the key
- **value** - a `String` that is the value