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

.. code-block:: js

    if( bot.state === 3 ) // ready to go
    
user
~~~~
A `User`_ object representing the user of the signed in client.
    


Functions
---------

.. _User : #user