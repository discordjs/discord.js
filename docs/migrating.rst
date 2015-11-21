.. include:: ./vars.rst

Updating to v5.0.0
==================

If you're coming from versions below v5, you might find some changes. Here are the major changes:

Change 1
--------

.. code-block:: js

	// OLD:

	client.getUser();
	client.getServer();
	server.getMember(); // etc etc

	// NEW:

	client.users.get();
	client.servers.get();
	client.members.get();
	
Change 2
--------

.. code-block:: js

	// OLD:
	
	client.on("serverNewMember", (member, server) => {
	
	});
	
	// NEW:
	
	client.on("serverNewMember", (server, user) => {
	
	});
	
Change 3
---------

The Member Class has been removed, meaning you can't use ``member.permissionsIn(channel)``. To get permissions, use ``channel.permissionsOf(user)``.