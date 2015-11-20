.. include:: ./vars.rst

Members
=======

The Member Class is used to represent a User_ but specific to a server. **Any attributes/functions available in the User class are omitted.**

How do I get a Member from a User?
----------------------------------

Sometimes you might want a Member object, but instead you are given a User_ object. Since Members belong to servers, you can just do:

.. code-block:: js
	
	server.getMember("id", user.id);
	
This code will either return `false` if no member is found, or a Member if one is found. This method will work if you are given either a User OR Member object.

Attributes
----------

server
~~~~~~

The Server_ that the Member belongs to.

roles
~~~~~

An `Array` of ServerPermissions_ and ChannelPermissions_ that the Member is affected by.

rawRoles
~~~~~~~~

An `Array` of role IDs.

Functions
---------

hasRole(role)
~~~~~~~~~~~~~

Returns a `Boolean` depending on whether or not a user has a certain role.

- **role** - The ServerPermissions_ you want to see if a user has.

permissionsIn(channel)
~~~~~~~~~~~~~~~~~~~~~~

Returns an EvaluatedPermissions_ giving the final permissions of the Member in a channel.

- **channel** - The Channel_ that you want to evaluate the permissions in.