Client Documentation
====================

Attributes
----------

``options``
~~~~~~~~~~~
An `Object` containing a configuration for the Client. Currently can only be configured like so:

.. code-block:: js

    {
        queue : false // whether messages should be sent one after the other or
                      // just send straight away.
    }

``token``
~~~~~~~~~
A `String` that is the token received after logging in. It is used to authorise the Client when joining WebSockets or making HTTP requests.

``state``
~~~~~~~~~
An `Integer` representing what state of connection the Client is in.

- **0** is idle, meaning the Client has been created but no login attempts have been made.
- **1** is logging in, meaning the Client is in the process of logging in.
- **2** is logged in, meaning the Client is logged in but not necessarily ready.
- **3** is ready, meaning the Client is ready to begin listening.
- **4** is disconnected, meaning the Client was disconnected due to any reason.

Functions
---------