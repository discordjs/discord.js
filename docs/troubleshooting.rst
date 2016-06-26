Troubleshooting
===============

General
-------

Occasionally, the API can stop working for whatever reason. If it was working previously and it stopped working on the same version, it means that either we screwed code up or there's been a change to the Discord API. You can try asking around in the `discord.js channel in the API server`_. You could also `make an issue`_ if one relating to a similar issue doesn't exist. Please post a stacktrace if there is one, and be as detailed as possible - *"the API isn't working"* doesn't help at all.

If there is already an issue, feel free to comment that you're also experiencing the same thing. This helps to see how widespread the bug is.

You can try reconnecting before submitting an issue, as sometimes some of the servers may be slightly different.

Voice
------

Often, especially if you're on Windows, voice will not work out of the box.
Follow the steps below, one by one.


- Is your system supported? The following are:
    - Linux x64 & ia32
    - Linux ARM (Raspberry Pi 1 & 2)
    - Mac OS X x64
    - Windows x64
- Did you install Python 2.7.x correctly? Is it in your PATH? ``python -V``. If not, install it correctly and try reinstalling.
    - **Windows** - See https://python.org/downloads/
    - **Linux / Mac OS** - Unix systems should already have it installed, but if not, use the OS's package manager
- Did you install FFMPEG correctly? Is it in your PATH? ``ffmpeg -version``. If not, install it correctly and try reinstalling.
    - **Windows** - `Follow this guide`_
    - **Linux / Mac OS** - Use your OS's package manager
- Did you install the required C++ compiler tool for your OS? If not, install the corresponding program, **then** try reinstalling discord.js ``npm i -S discord.js``
    - **Windows** - `Visual Studio 2015`_ with `C++ Support enabled`_
    - **Linux** - build-essential
    - **Mac OS** - Xcode CLI tools

If you're still having problems try
    - ``npm cache clean``
    - ``npm config set msvs_version 2015``
    - ``npm i -S discord.js``

If nothing of the above helped, feel free to jump on the `discord.js channel in the API server`_

.. _discord.js channel in the API server : https://discord.gg/0SBTUU1wZTYcFtmP
.. _make an issue : https://github.com/hydrabolt/discord.js/issues
.. _Follow this guide : http://adaptivesamples.com/how-to-install-ffmpeg-on-windows/
.. _Visual Studio 2015 : https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx
.. _C++ Support enabled : https://social.msdn.microsoft.com/Forums/getfile/740020
