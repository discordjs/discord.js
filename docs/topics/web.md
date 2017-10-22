# Web builds
In addition to your usual Node applications, discord.js has special distributions available that are capable of running in web browsers.
This is useful for client-side web apps that need to interact with the Discord API.
[Webpack 3](https://webpack.js.org/) is used to build these.

## Restrictions
- Any voice-related functionality is unavailable, as there is currently no audio encoding/decoding capabilities without external native libraries,
  which web browsers do not support.
- The ShardingManager cannot be used, since it relies on being able to spawn child processes for shards.
- None of the native optional packages are usable.

### Require Library
If you are making your own webpack project, you can require `discord.js/browser` wherever you need to use discord.js, like so:
```js
const Discord = require('discord.js/browser');
// do something with Discord like you normally would
```

### Webpack File
You can obtain your desired version of discord.js' web build from the [webpack branch](https://github.com/hydrabolt/discord.js/tree/webpack) of the GitHub repository.
There is a file for each branch and version of the library, and the ones ending in `.min.js` are minified to substantially reduce the size of the source code.

Include the file on the page just as you would any other JS library, like so:
```html
<script type="text/javascript" src="discord.VERSION.min.js"></script>
```

Rather than importing discord.js with `require('discord.js')`, the entire `Discord` object is available as a global (on the `window`) object.
The usage of the API isn't any different from using it in Node.js.

#### Example
```html
<script type="text/javascript" src="discord.11.1.0.min.js"></script>
<script type="text/javascript">
  const client = new Discord.Client();

  client.on('message', msg => {
    const guildTag = msg.channel.type === 'text' ? `[${msg.guild.name}]` : '[DM]';
    const channelTag = msg.channel.type === 'text' ? `[#${msg.channel.name}]` : '';
    console.log(`${guildTag}${channelTag} ${msg.author.tag}: ${msg.content}`);
  });

  client.login('some crazy token');
</script>
```
