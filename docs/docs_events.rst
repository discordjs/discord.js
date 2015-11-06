======
Events
======

Available events
----------------

channelCreate Event
~~~~~~~~~~~~~~~~~~~

Event fired a channel is created from the connected server.

Available parameters
^^^^^^^^^^^^^^^^^^^^

channel: The channel resolvable object of the created channel.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("channelCreate", function(channel){

		// YOUR CODE HERE

    });

channelDelete Event
~~~~~~~~~~~~~~~~~~~

Event fired a channel is deleted from the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

channel: The channel resolvable object of the deleted channel.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("channelDelete", function(channel){

		// YOUR CODE HERE

    });

channelUpdate Event
~~~~~~~~~~~~~~~~~~~

Event fired a channel is updated from the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

oldChannel: Channel resolvable object of the old channel.
newChannel: Channel resolvable object of the new channel.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("channelUpdate", function(oldChannel, newChannel){

		// YOUR CODE HERE

    });

disconnected Event
~~~~~~~~~~~~~~~~~~

Event fired when the client state is set to disconnected.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

None.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("disconnected", function(){

		// YOUR CODE HERE

    });

error Event
~~~~~~~~~~~

Event fired when the client can't parse the WebSocket packet to JSON.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

error: The error object
packet: The WebSocket packet that caused the error

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("error", function(error, packet){

		// YOUR CODE HERE

    });


message Event
~~~~~~~~~~~~~

Event fired when a new message is send from the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

message: The message data.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("message", function(message){

		// YOUR CODE HERE

    });

See the page `Creating a Simple Bot`_ for a more complete example of the message event.

messageDelete Event
~~~~~~~~~~~~~~~~~~~

Event fired when a message is deleted from the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

channel: The channel resolvable from where the message was deleted.
message: The message data if available from the cache.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("messageDelete", function(message){

		// YOUR CODE HERE

    });

messageUpdate Event
~~~~~~~~~~~~~~~~~~~

Event fired when a message is updated from the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

newMessage: The new, edited, message
oldMessage: The old message data.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("messageUpdate", function(newMessage, oldMessage){

		// YOUR CODE HERE

    });

presence Event
~~~~~~~~~~~~~~

Event fired when a user presence is modified.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

data: JSON object of the presence data with following format:

.. code-block:: JSON

    {
        user: user,
        oldStatus: oldStatus,
        status: newStatus,
        server: server,
        gameId: gameID,
    }


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("presence", function(data){

		// YOUR CODE HERE

    });


raw Event
~~~~~~~~~

Event fired when the client finish parsing the WebSocket packet.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

data: Raw data from the WebSocket (Parsed to JSON)

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("raw", function(data){

		// YOUR CODE HERE

    });

ready Event
~~~~~~~~~~~

Event fired when the client is ready.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

None.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("ready", function(){

		// YOUR CODE HERE

    });

serverNewMember Event
~~~~~~~~~~~~~~~~~~~~~

Event fired a new member is added to the server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

member: User resolvable object of the new member.
server: The server resolvable object of the deleted server.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverNewMember", function(member, server){

		// YOUR CODE HERE

    });

serverCreate Event
~~~~~~~~~~~~~~~~~~

Event fired a server is created.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

server: The server resolvable object of the server.

Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverCreate", function(server){

		// YOUR CODE HERE

    });

serverDelete Event
~~~~~~~~~~~~~~~~~~

Event fired the server is deleted.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

server: The server resolvable object of the deleted server .


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverDelete", function(server){

		// YOUR CODE HERE

    });

serverMemberUpdate Event
~~~~~~~~~~~~~~~~~~~~~~~~

Event fired when a member role are updated on the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

member: The user resolvable object of the updated member.
roles: The new roles of the member.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverMemberUpdate", function(member, roles){

		// YOUR CODE HERE

    });

serverRoleCreate Event
~~~~~~~~~~~~~~~~~~~~~~

Event fired when a role is created on the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

server: The server resolvable object of the connected server.
role: The new role on the server.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverRoleCreate", function(server, role){

		// YOUR CODE HERE

    });

serverRoleDelete Event
~~~~~~~~~~~~~~~~~~~~~~

Event fired when a role is deleted on the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

server: The server resolvable object of the connected server.
role: The deleted role on the server.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverRoleDelete", function(server, role){

		// YOUR CODE HERE

    });

serverRoleDelete Event
~~~~~~~~~~~~~~~~~~~~~~

Event fired when a role is updated on the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

server: The server resolvable object of the connected server.
oldRole: The old role on the server.
newRole: The new role.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverRoleUpdate", function(server, oldRole, newRole){

		// YOUR CODE HERE

    });

serverUpdate Event
~~~~~~~~~~~~~~~~~~

Event fired the server is updated.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

server: The server resolvable object of the old server.
newServer: The server resolvable of the new server.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("serverUpdate", function(server, newServer){

		// YOUR CODE HERE

    });

startTyping Event
~~~~~~~~~~~~~~~~~

Event fired a user starts typing.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

user: The user resolvable object of the typing user.
channel: The server resolvable of the typing user.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("startTyping", function(user, channel){

		// YOUR CODE HERE

    });

stopTyping Event
~~~~~~~~~~~~~~~~

Event fired a user stops typing.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

user: The user resolvable object of the typing user.
channel: The server resolvable of the typing user.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("stopTyping", function(user, channel){

		// YOUR CODE HERE

    });

userBanned Event
~~~~~~~~~~~~~~~~

Event fired when a user is ban from the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

bannedUser: The user resolvable object of the banned user.
server: The server resolvable object of the connected server.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("userBanned", function(bannedUser, server){

		// YOUR CODE HERE

    });

userUnbanned Event
~~~~~~~~~~~~~~~~~~

Event fired a user in unban from the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

bannedUser: The user resolvable object of the unbanned user.
server: The server resolvable object of the connected server .


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("userUnbanned", function(bannedUser, server){

		// YOUR CODE HERE

    });

userUpdate Event
~~~~~~~~~~~~~~~~

Event fired when a user is updated on the connected server.

Available Parameters
^^^^^^^^^^^^^^^^^^^^

newUser: The user resolvable object of the new user.
oldUser: The user resolvable object of the old user.


Code Example
^^^^^^^^^^^^

.. code-block:: js

    bot.on("userUpdate", function(newUser, oldUser){

		// YOUR CODE HERE

    });




.. _Creating a Simple Bot : http://discordjs.readthedocs.org/en/latest/create_simple_bot.html

