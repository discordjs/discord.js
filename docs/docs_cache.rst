.. include:: ./vars.rst

Cache
=====

**extends Array**

A Cache object extends an Array (so it can be used like a regular array) but introduces helper functions to make it more useful when developing with discord.js. Unlike a regular array, it doesn't care about the instance or prototype of an object, it works purely on properties.

**Examples:**

.. code-block:: js

	client.users.get("id", 11238414);
	
	client.channels.getAll("name", "general");

--------

Functions
---------

get(key, value)
~~~~~~~~~~~~~~~

Returns a contained object where ``object[key] == value``. Returns the first object found that matches the criteria.

getAll(key, value)
~~~~~~~~~~~~~~~~~~

Similar to ``cache.get(key, value)``, but returns a Cache of any objects that meet the criteria.

has(key, value)
~~~~~~~~~~~~~~~

Returns `true` if there is an object that meets the condition ``object[key] == value`` in the cache

add(data)
~~~~~~~~~

Adds an object to the Cache as long as all the other objects in the cache don't have the same ID as it.

update(old, data)
~~~~~~~~~~~~~~~~~

Updates an old object in the Cache (if it exists) with the new one.

remove(data)
~~~~~~~~~~~~

Removes an object from the cache if it exists.