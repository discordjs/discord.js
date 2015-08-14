# hydrabot
Hydrabot is an open-source bot made with the intents of demonstrating the capabilities of [discord.js](https://github.com/hydrabolt/discord.js/).

### Set up
The easiest setup would be to clone the discord.js repo, and then open a terminal/cmd in this directory and run `node hydrabot.js`.

If you don't want to clone the repo but instead just use this folder, you need to edit `hydrabot.js` to use `require("discord.js")` as opposed to `require("../")`. Cloned directories will always be using the latest **discord.js**.

### Setting up credentials

Create `config.json` to use your Discord email and password, and then run `node hydrabot.js`.

What config.json should look like:
```js
{
    "email" : "your email",
    "password" : "your password"
}
```
