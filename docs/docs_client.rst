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

Functions
---------

.. note :: Any functions used here that take callbacks as an optional parameter can also be used as Promises_. Promises take the exact same parameters for each use case, except errors are moved to catch statements instead of then. For example, you can do:

.. code-block:: js

    bot.login(email, password).then(success).catch(err);
    
    function success(token){
    
    }
    
    function err(error){
    
    }
    
    // OR use callbacks:
    
    bot.login(email, password, function(error, token){
    
    });
	
login(email, password, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Logs the client in so it can begin initialising. Use this `after` registering your events to ensure they are called!

- **email** - The e-mail used to sign in, `String`.
- **password** - The password used to sign in, `String`.
- **callback** - `function` that takes the following parameters:

	- **error** - An error if any occurred
	- **token** - The token received after logging in, `String`.

logout(`callback`)
~~~~~~~~~~~~~~~~~~

Logs the client out and closes the WebSocket connections.

- **callback** - `function` that takes the following parameter:

	- **error** - An error if any occurred
	
sendMessage(channel, content, `options`, `callback`)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sends a message to the specified channel.

- **channel** - a `Channel Resolvable`_
- **content** - a `String Resolvable`_ - the message you want to send
- **options** - `object` containing:

	- **tts** - `Boolean`, should message be text-to-speech
- **callback** - `function` that takes the following parameters:

	- **error** - error object if any occurred
	- **message** - the sent Message_