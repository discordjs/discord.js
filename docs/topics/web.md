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
<script src="discord.12.0.0.min.js"></script>
<script>
  const clientID = '187406016902594560';
  const scopes = ['rpc', 'rpc.api', 'messages.read'];

  // This demonstrates discord's implicit oauth2 flow
  // http://discordapi.com/topics/oauth2#implicit-grant

  const params = new URLSearchParams(document.location.hash.slice(1));

  if (!params.has('access_token')) {
    // Redirect to discord to get an access token
    document.location.href =
      `https://discordapp.com/oauth2/authorize?response_type=token&client_id=${clientID}&scope=${scopes.join('+')}`;
  }

  const client = new Discord.RPCClient();

  client.on('ready', () => {
    console.log('Logged in as', client.application.name);
    console.log('Authed for user', client.user.tag);
  });

  // Log in to rpc with client id and access token
  client.login(clientID, { accessToken: params.get('access_token') });
</script>
```
