.. include:: ./vars.rst

Invite
======

Used to represent data of an invite.

--------

Attributes
----------

maxAge
~~~~~~

`Number`, how long (in seconds) the invite has since creation before expiring.

code
~~~~

`String`, the invite code.

server
~~~~~~

The Server_ the invite is for.

channel
~~~~~~~

The ServerChannel_ the invite is for.

revoked
~~~~~~~

`Boolean`, whether the invite has been revoked or not.

createdAt
~~~~~~~~~

`Number`, timestamp of when the invite was created.

temporary
~~~~~~~~~

`Boolean`, whether the invite is temporary or not.

uses
~~~~

`Number`, uses of the invite remaining.

maxUses
~~~~~~~

`Number`, maximum uses of the invite.

inviter
~~~~~~~

User_ who sent/created the invite.

xkcd
~~~~

`Boolean`, whether the invite is intended to be easy to read and remember by a human.