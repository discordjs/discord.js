# About the Rewrite
The rewrite takes a much more OOP approach than previous versions, which allows code to be much more manageable.
It's been rebuilt from the ground up and should be much more stable, fixing caching issues that affected
older versions and it also has support for new Discord Features, such as emojis.

## Upgrading your code
The rewrite has a _lot_ of breaking changes. Major methods, e.g. `client.sendMessage(channel, message)` have been moved
from the Client class towards their respective classes - `textChannel.sendMessage(message)`. You can find out the full
extent of these changes by looking at the classes in the documentation.

Additionally, some event names and parameters have changed - you should revisit these.
