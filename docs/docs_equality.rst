.. include:: ./vars.rst

Equality
========

The Equality class is used to see if two objects are equal, based on ``object_1.id === object_2.id``.

If any class in Discord extends equality, it means you should never the default equality operands (``==`` & ``===``) as they could potentially be different instances and therefore appear not to be equal. Instead, use ``equalityObject.equals()`` as shown below.

--------

Functions
---------

equals(object)
~~~~~~~~~~~~~~

Returns true if the specified object is the same as this one.

- **object** - Any `object` with an ``id`` property.