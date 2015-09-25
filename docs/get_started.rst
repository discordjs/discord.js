===========
Get Started
===========

Installation
------------

Linux / OS X
~~~~~~~~~~~~
Run ``npm install discord.js --save`` in your project's directory and you should be good to go!

Windows
~~~~~~~~~~~~
Unfortunately, the Windows installation process is a little more lengthy. You need to have `Visual Studio Express`_ (or any of the other distributions of it). This is necessary for build tools for the WebSocket dependency.

.. note:: If you are using another version of Visual Studio, such as 2012, replace the flag with ``--msvs_version=2012``

After you have obtained these tools, you need to run ``npm install discord.js --save --msvs_version=2015`` in your working directory. Hopefully this should all go well!

Cloning the Repo
----------------
If you want to try some examples or make your own changes to discord.js, you can `clone the repo`_. After that run ``npm install`` to install dependencies.

Running Examples
~~~~~~~~~~~~~~~~
If you've cloned the repo, you also have the option to run some examples. You can also do this by just copying the examples_ and then running them. I'd be more than happy to get some pull requests if you want to make any patches ;)


Before you run them though, you need to configure the ``examples/auth.json`` file. This should contain valid Discord credentials and passwords.

After you've configured your credentials, just run ``node examples/pingpong.js`` to run the ping pong example.



.. _Visual Studio Express: https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx
.. _clone the repo: https://github.com/hydrabolt/discord.js.git
.. _examples: https://github.com/hydrabolt/discord.js/tree/master/examples