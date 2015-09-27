.. include:: ./vars.rst

Client Documentation
====================

This page contains documentation on the `Discord.Client` class. This should be used when you want to start creating things with the API.

Attributes
----------

options
~~~~~~~
An `Object` containing a configuration for the Client. Currently can only be configured like so:

.. code-block:: js

    {
        queue : false // whether messages should be sent one after the other or
                      // just send straight away.
    }

token
~~~~~
A `String` that is the token received after logging in. It is used to authorise the Client when joining WebSockets or making HTTP requests. Example token:

.. code-block:: js

    ODAzTOc4MTA2BjQ2MjY4ODg.COmrCA.fEtD_Tc0JU6iZJU_11coEWBOQHE

state
~~~~~
An `Integer` representing what state of connection the Client is in.

- **0** is idle, meaning the Client has been created but no login attempts have been made.
- **1** is logging in, meaning the Client is in the process of logging in.
- **2** is logged in, meaning the Client is logged in but not necessarily ready.
- **3** is ready, meaning the Client is ready to begin listening.
- **4** is disconnected, meaning the Client was disconnected due to any reason.

See also ready_.

.. code-block:: js

    if( bot.state === 3 ) // ready to go
    
user
~~~~
A `User`_ object representing the account of the signed in client. This will only be available when the client is in the ready state (3).
    
.. code-block:: js

    bot.user.username; // username of the account logged in
    
email
~~~~~
A `String` that is the email used to sign the client in.

password
~~~~~~~~
A `String` that is the password used to sign the client in.
    
readyTime
~~~~~~~~~
A `Number` representing the unix timestamp from when the client was ready. `Null` if not yet ready.

.. code-block:: js

    bot.readyTime; // 1443378242464
    
uptime
~~~~~~
A `Number` representing how many milliseconds have passed since the client was ready. `Null` if not yet ready.

.. code-block:: js

    if( bot.uptime > 5000 ) // true if the client has been up for more than 5 seconds

ready
~~~~~
A `Boolean` that is true if the client is ready. A shortcut to checking if ``bot.state === 3``.

servers
~~~~~~~
An `Array` of Server_ objects that the client has access to.

channels
~~~~~~~~
An `Array` of Channel_ objects that the client has access to.

users
~~~~~
An `Array` of User_ objects that the client has access to.

PMChannels
~~~~~~~~~~
An `Array` of PMChannel_ objects the client has access to.

messages
~~~~~~~~
An `Array` of Message_ objects the client has received over its uptime.

Functions
---------

.. note :: Any functions used here that take callbacks as an optional parameter can also be used as Promises_. For example, you can do:
.. code-block:: js

    bot.login(email, password).then(success).catch(err);
    
    // OR use callbacks:
    
    bot.login(email, password, function(err, token){
    
    });