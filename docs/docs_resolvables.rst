.. include:: ./vars.rst

Resolvables
===========

In discord.js, the aim is to allow the end developer to have freedom in what sort of data types they supply. References to any sort of resolvable basically mean what types of data you can provide. The different resolvables are shown before:

--------

Channel Resolvable
------------------

A Channel Resolvable allows:

- Channel_
- Server_
- Message_
- User_ (in some instances)
- String of Channel ID
- String of User ID

File Resolvable
------------------

A File Resolvable allows:

- URL
- Local file path
- Readable stream

Role Resolvable
------------------

A Role Resolvable allows:

- Role ID
- Role_

Voice Channel Resolvable
------------------------

A Voice Channel Resolvable allows:

- VoiceChannel_
- Voice Channel ID

Message Resolvable
------------------

A Message Resolvable allows:

- Message_
- TextChannel_
- PMChannel_

User Resolvable
---------------

A User Resolvable allows:

- User_
- Message_
- TextChannel_
- PMChannel_
- Server_
- String of User ID

String Resolvable
-----------------

A String Resolvable allows:

- Array
- String

Server Resolvable
-----------------

A Server Resolvable allows:

- Server_
- ServerChannel_
- Message_ (only for messages from server channels)
- String of Server ID

Invite ID Resolvable
--------------------

An Invite ID Resolvable allows:

- Invite_
- String_ containing either a http link to the invite or the invite code on its own.

Base64 Resolvable
-----------------

A Base64 Resolvable allows:

- Buffer
- String