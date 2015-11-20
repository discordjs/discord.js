Creating a Simple Bot
=====================

This page will walk you through writing a simple bot and will introduce you to some of the most important functions and objects you will encounter in the API.

Setting up a Project
--------------------

Before you start creating your bot, you need to create a directory, for example *discordbot*.

After you've done that, open up the directory and have a look at how to `install the module`_. After you've installed the module, you can progress to the next step

Creating the Bot
----------------

Now we can begin writing the bot. This bot will just server the user their avatar but at a higher resolution - assuming they have one.

Firstly, create a file named ``bot.js`` in the directory you made earlier. Open it up, and type the following lines of code:

.. code-block:: js

    var Discord = require("discord.js");
    var bot = new Discord.Client();

This code firstly imports the discord.js module, which contains classes to help you create clients for Discord. The second line creates a new Discord Client, which we can manipulate later. Now, we want the client to be alerted when there is a new message and do something, so we can type this:

.. code-block:: js

    bot.on("message", function(message){

    } )

This will simply get our client to listen out for new messages, but not yet do anything. Let's have a look at this:

.. code-block:: js

    bot.on("message", function(message){
        
		if( message.content === "avatar me!" ){
		
		}
		
    } )

This code will now get our client to execute anything inside the if statement as long as the message sent was "avatar me!" We can now get it to see if the user has an avatar:

.. code-block:: js

    bot.on("message", function(message){
        
		if( message.content === "avatar me!" ){
		    
            var usersAvatar = message.sender.avatarURL;
            
            if(usersAvatar){
                // user has an avatar
            }else{
                // user doesn't have an avatar
            }
            
		}
		
    } )
    
This code will now see if the user has an avatar and then do something based on that, let's finalise it:

.. code-block:: js

    bot.on("message", function(message){
        
		if( message.content === "avatar me!" ){
		    
            var usersAvatar = message.sender.avatarURL;
            
            if(usersAvatar){
                // user has an avatar
                
                bot.reply(message, "your avatar can be found at " + usersAvatar);
                
            }else{
                // user doesn't have an avatar
                
                bot.reply(message, "you don't have an avatar!");
            }
            
		}
		
    } )
    
Let's have a look at the function we used here; *bot.reply*. This function takes 2 necessary parameters, a message object to reply to and a message to send. The first parameter we already have, and it is the message we have received. The second parameter is what we want to send.

Now that we've finished the listener event, we need to log the client in:

.. code-block:: js

    bot.login("your discord email", "your discord password");
    
And that's it! Run the code with ``node bot.js`` and wait a few seconds, and then try sending *avatar me!* to any of the channels that the user you provided has details to.
    
Final Product
-------------
.. code-block:: js

    var Discord = require("discord.js");
    var bot = new Discord.Client();
    
    bot.on("message", function(message){
        
		if( message.content === "avatar me!" ){
		    
            var usersAvatar = message.sender.avatarURL;
            
            if(usersAvatar){
                // user has an avatar
                
                bot.reply(message, "your avatar can be found at " + usersAvatar);
                
            }else{
                // user doesn't have an avatar
                
                bot.reply(message, "you don't have an avatar!");
            }
            
		}
		
    } );
    
    bot.login("your discord email", "your discord password");
    
.. note:: This page is still a WIP, check back later for more documentation on it.

.. _install the module : http://discordjs.readthedocs.org/en/latest/get_started.html#installation