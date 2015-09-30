.. include:: ./vars.rst

Invite Documentation
====================

The Invite Class is used to represent data about an Invite.

Attributes
----------

max_age
~~~~~~~

A `Number` in minutes for how long the Invite should be valid for. E.g. a value of ``3600`` is equal to 30 minutes.

code
~~~~

`String` an alphanumeric code for the Invite.

revoked
~~~~~~~

`Boolean` that dictates whether the Invite has been cancelled or not

created_at
~~~~~~~~~~

A unix timestamp as a `Number` which is the time that the invite was created.

temporary
~~~~~~~~~

`Boolean` that dictates whether the invite is temporary.

uses
~~~~

`Number` the number of uses of the Invite, a value of ``0`` is none.

max_uses
~~~~~~~~

`Number` that is the maximum amount of uses of the invite, ``0`` is unlimited.

inviter
~~~~~~~

The User_ that created the invite.

xkcd
~~~~

`Boolean` that is true if the invite should be human-readable.

channel
~~~~~~~

The Channel_ that the invite is inviting to.

URL
~~~

A `String` that generates a clickable link to the invite.