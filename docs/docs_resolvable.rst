.. include:: ./vars.rst

Resolvable Documentation
========================

To be robust, discord.js needs to handle a wide amount of ambiguous data that is supplied to it. This means you can use functions much more easily. Anything that is resolvable means it can be normalised without you having to do it explicitly.

Resolvables are not objects or classes, they are just ways of expressing what type of data is expected.

Channel Resolvable
------------------

A Channel Resolvable is data that can be resolved to a channel ID. Here is what is currently supported:

- A Channel_ object
- A Server_ object (the #general channel of the server will be used)
- A `String` representing the channel ID
- A Message_ (the channel the message was sent in will be used)
- A User_ (will get the PM channel with the specified user)

.. note:: A User cannot always be specified in certain cases. For example, if using `bot.setTopic`, a User or PM Channel can't be specified as these do not support channel topics.

Server Resolvable
-----------------

Invite Resolvable
-----------------