.. include:: ./vars.rst

Permission Constants
====================

In discord.js, you can handle permissions in two ways. The preferred way is to just use the string name of the permission, alternatively you can use ``Discord.Constants.Permissions["permission name"]``.

--------

Valid Permission Names
----------------------

.. code-block:: js

	{
		// general
		createInstantInvite,
		kickMembers,
		banMembers,
		manageRoles,
		managePermissions,
		manageChannels,
		manageChannel,
		manageServer,
		// text
		readMessages,
		sendMessages,
		sendTTSMessages,
		manageMessages,
		embedLinks,
		attachFiles,
		readMessageHistory,
		mentionEveryone,
		// voice
		voiceConnect,
		voiceSpeak,
		voiceMuteMembers,
		voiceDeafenMembers,
		voiceMoveMembers,
		voiceUseVAD
	};

Preferred Way
-------------

The preferred way of using permissions in discord.js is to just use the name. E.g:

``role.hasPermission("voiceUseVAD")``

Alternative
-----------

You can also go the long way round and use the numerical permission like so:

``role.hasPermission( Discord.Constants.Permissions.voiceUseVAD )``