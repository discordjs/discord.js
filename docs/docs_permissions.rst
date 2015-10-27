.. include:: ./vars.rst

Permissions Documentation
=========================

The Permissions Class represents data of permissions/roles.

ServerPermissions
-----------------

ServerPermissions are also known as roles. They give the general gist of permissions of all users in a Server.

name
~~~~

`String` that is the name of the role.

color
~~~~~

`Number` that is the color of role, use Discord.Color to resolve (see source code under refs/colors.js)

hoist
~~~~~

`Boolean`, whether the role should be a separate category in the users list.

managed
~~~~~~~

`Boolean`, whether the permission is managed by Discord. Currently only used by Twitch integration.

position
~~~~~~~~

`Number`, the position of the role that states its importance.

id
~~

`Number`, the ID of the role.

server
~~~~~~

Server_ that the role belongs to.

Actual Permissions:
~~~~~~~~~~~~~~~~~~~

`Actual Permissions` is not an attribute, however the following permissions are attributes of ServerPermissions. They are self-explanatory.

.. code-block:: js

	{
		createInstantInvite,
		manageRoles, // if this is true all the others are true
		manageChannels,
		readMessages,
		sendMessages,
		sendTTSMessages,
		manageMessages, // deleting, editing etc
		embedLinks,
		attachFiles,
		readMessageHistory,
		mentionEveryone,
		voiceConnect,
		voiceSpeak,
		voiceMuteMembers,
		voiceDeafenMembers,
		voiceMoveMembers,
		voiceUseVoiceActivation
	}
	
serialize()
~~~~~~~~~~~

**Aliases** : *serialise()*

To get a valid `Object` of the actual permissions of the object, just do `serverPermissions.serialise()` to get an object with the above mentioned permissions

ChannelPermissions
------------------

ChannelPermissions are based from a ServerPermissions object (although not actually extending them, none of the Permissions objects extend each other). It represents an override/overwrite of a server permission.

Actual Permissions:
~~~~~~~~~~~~~~~~~~~

.. code-block:: js

	{
		createInstantInvite,
		manageRoles,
		manageChannels,
		readMessages,
		sendMessages,
		sendTTSMessages,
		manageMessages,
		embedLinks,
		attachFiles,
		readMessageHistory,
		mentionEveryone,
		voiceConnect,
		voiceSpeak,
		voiceMuteMembers,
		voiceDeafenMembers,
		voiceMoveMember,
		voiceUseVoiceActivation
	}

serialize()
~~~~~~~~~~~

**Aliases** : *serialise()*

To get a valid `Object` of the actual permissions of the object, just do `channelPermissions.serialise()` to get an object with the above mentioned permissions

EvaluatedPermissions
--------------------

EvaluatedPermissions represents the permissions of a user in a channel, taking into account all roles and overwrites active on them; an evaluation of their permissions.

Actual Permissions:
~~~~~~~~~~~~~~~~~~~

EvaluatedPermissions has the same permissions as ChannelPermissions.

.. code-block:: js

	{
		createInstantInvite,
		manageRoles,
		manageChannels,
		readMessages,
		sendMessages,
		sendTTSMessages,
		manageMessages,
		embedLinks,
		attachFiles,
		readMessageHistory,
		mentionEveryone,
		voiceConnect,
		voiceSpeak,
		voiceMuteMembers,
		voiceDeafenMembers,
		voiceMoveMember,
		voiceUseVoiceActivation
	}

serialize()
~~~~~~~~~~~

**Aliases** : *serialise()*

To get a valid `Object` of the actual permissions of the object, just do `channelPermissions.serialise()` to get an object with the above mentioned permissions