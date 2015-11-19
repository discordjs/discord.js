.. include:: ./vars.rst

Client
======

This page contains documentation on the `Discord.Client` class. This should be used when you want to start creating things with the API.

Attributes
----------

users
~~~~~

A Cache_ of User_ objects that the client has cached.

channels
~~~~~~~~

A Cache_ of ServerChannel_ objects that the client has cached.

privateChannels
~~~~~~~~~~~~~~~

A Cache_ of PMChannel_ objects that the client has cached. These are all the Private/Direct Chats the client is in.

servers
~~~~~~~

A Cache_ of Server_ objects that the client has cached.

voiceConnection
~~~~~~~~~~~~~~~

A VoiceConnection_ object that is the current voice connection (if any).

readyTime
~~~~~~~~~

A `Number` unix timestamp dating to when the Client emitted `ready`.

uptime
~~~~~~

A `Number` in milliseconds representing how long the Client has been ready for.

user
~~~~

A User_ object representing the logged in client's user.