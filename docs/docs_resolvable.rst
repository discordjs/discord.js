.. include:: ./vars.rst

Resolvables
===========

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

A Server Resolvable is anything that can be resolved to a server ID. Here is what you can use:

- A Server_ object
- A Channel_ object
- A Message_ object
- A `String` representing the ID of the server

Invite Resolvable
-----------------

An Invite Resolvable is anything that resolves to an invite code. Here is what you can use:

- An Invite_ object
- A `String` which is either the code or an invite URL containing it (e.g. ``https://discord.gg/0SCTAU1wZTZtIopF``)