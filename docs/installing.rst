.. include:: ./vars.rst

Installing discord.js
=====================

To install discord.js, you need a few dependencies.

.. warning:: **When installing with any of these methods, you'll encounter some errors.** This is because an optional dependency isn't working properly, but discord.js should still work fine.

-----------

Windows
-------

------------

- You need `Visual Studio`_ and `Python 2.7`_.

Your Visual Studio installation ideally has to be recent, but you can try installing without it first. You can use **Express, Community, Enteprise** or any others apart from ``VS Code``.

- You (obviously) need `NodeJS`_. Node 4 or higher is recommended.

After you have installed these things, to install just run: ``npm install --save --msvs_version=2015 discord.js`` to install the latest version of discord.js for your project.

Additional Audio Support
~~~~~~~~~~~~~~~~~~~~~~~~

- Install `ffmpeg`_ and add it to your PATH.

-----------

Linux (Debian-based)
-----

-----------

- You (obviously) need `NodeJS Linux`_. Node 4 or higher is recommended.

.. code-block:: bash

	$ sudo apt-get install build-essential
	$ npm install --save discord.js


Additional Audio Support
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

	$ sudo apt-get install ffmpeg

Note: Ubuntu 14.04 needs to do:

.. code-block:: bash

    $ sudo add-apt-repository ppa:mc3man/trusty-media && sudo apt-get update && sudo apt-get install ffmpeg

.. _Visual Studio : https://www.visualstudio.com/downloads/download-visual-studio-vs
.. _Python 2.7 : https://www.python.org/download/releases/2.7.8/
.. _ffmpeg : https://www.ffmpeg.org/download.html
.. _NodeJS : https://nodejs.org/en/download/
.. _NodeJS Linux : https://nodejs.org/en/download/package-manager/