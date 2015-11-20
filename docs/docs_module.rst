.. include:: ./vars.rst

Module
======

The Module (``require("discord.js")``) contains some helper functions/objects as well the classes use in Discord. The Classes available are omitted as they are visible under the rest of the `Documentation` section.

Discord.Colors
--------------

Currently Colors are only usable in Roles_. You can't use any colour in messages, unless it's syntax highlighting from codeblocks.

.. note:: There is currently an unresolved bug in Discord, long story short any hex colors provided that start with a 0 (e.g. #00FF00) will be changed to #10FF00 to ensure they render properly.

Example Usage
~~~~~~~~~~~~~

.. code-block:: js

    // valid color usage (examples 2-4 only from version 3.10.2):

    mybot.createRole(server, {
        color : Discord.Colors.AQUA
    });
    
    mybot.createRole(server, {
        color : "#ff0000"
    });
    
    mybot.createRole(server, {
        color : "ff0000"
    });
    
    mybot.createRole(server, {
        color : 0xff0000
    });

Preset Colors:
~~~~~~~~~~~~~~

.. code-block:: js

    // these values are just hex converted to base 10
    // e.g.
    
    //  15844367 -> #f1c40f
    //    dec         hex

    {
        DEFAULT: 0,
        AQUA: 1752220,
        GREEN: 3066993,
        BLUE: 3447003,
        PURPLE: 10181046,
        GOLD: 15844367,
        ORANGE: 15105570,
        RED: 15158332,
        GREY: 9807270,
        DARKER_GREY: 8359053,
        NAVY: 3426654,
        DARK_AQUA: 1146986,
        DARK_GREEN: 2067276,
        DARK_BLUE: 2123412,
        DARK_PURPLE: 7419530,
        DARK_GOLD: 12745742,
        DARK_ORANGE: 11027200,
        DARK_RED: 10038562,
        DARK_GREY: 9936031,
        LIGHT_GREY: 12370112,
        DARK_NAVY: 2899536
    }
    
toHex(num)
~~~~~~~~~~

Converts a base 10 color (such as the one found in ``serverPermissions.color``) to a valid hex string (e.g. ``#ff0000``)

- **num** - `Number` that you want to convert to hex

.. code-block:: js

    // converts Discord.Color.DARK_NAVY to hex:
    
    Discord.Color.toHex( Discord.Color.DARK_NAVY ); // returns '#2C3E50'
   
toDec(data)
~~~~~~~~~~~

Converts a hex string to a valid, base 10 Discord color.

- **data** - `String` that you want to convert, valid formats include: ``ff0000` and ``#ff0000`. If a valid base 10 color (e.g. ``0xff0000`` is passed, this is returned, making the function well at handling ambiguous data.

.. code-block:: js 
    
    // if you want to create/update a role, you don't have to use
    // Color.toDec, this is done for you.

    Discord.Color.toDec( "#ff0000" ); // 16711680
    Discord.Color.toDec( "ff0000" ); // 16711680
    Discord.Color.toDec( 0xff0000 ); // 16711680