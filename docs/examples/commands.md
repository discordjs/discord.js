# Slash Commands

In this example, you'll get to know how to create commands and listen to incoming interactions.

## Creating a Command

First off, we need to create a command so that users can use it. We will create an `echo` command which simply returns what the user inputted. Note that global commands can take up to an hour to appear in the client, so if you want to test a new command, you should create it for one guild first.

```js
// The data for our command
const commandData = {
  name: 'echo',
  description: 'Replies with your input!',
  options: [{
    name: 'input',
    type: 'STRING',
    description: 'The input which should be echoed back',
    required: true,
  }],
};

client.once('ready', () => {
  // Creating a global command
  client.application.commands.create(commandData);

  // Creating a guild-specific command
  client.guilds.cache.get('id').commands.create(commandData);
});
```

And that's it! As soon as your client is ready, it will register the `echo` command.

## Handling Commands

Now let's implement a simple handler for it:

```js
client.on('interaction', interaction => {
  // If the interaction isn't a slash command, return
  if (!interaction.isCommand()) return;

  // Check if it is the correct command
  if (interaction.commandName === 'echo') {
    // Get the input of the user
    const input = interaction.options[0].value;
    // Reply to the command
    interaction.reply(input);
  }
});
```

The `interaction` event will get emitted every time the client receives an interaction. Only our own slash commands trigger this event, so there is no need to implement a check for commands that belong to other bots.
