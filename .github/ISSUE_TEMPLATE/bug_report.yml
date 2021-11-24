name: Bug report
description: Report incorrect or unexpected behavior of discord.js
labels: [bug, need repro]
body:
  - type: markdown
    attributes:
      value: |
        Use Discord for questions: https://discord.gg/djs
        If you are reporting a voice issue, please post your issue at https://github.com/discordjs/voice/issues
  - type: textarea
    id: description
    attributes:
      label: Issue description
      description: |
        Describe the issue in as much detail as possible.

        Tip: You can attach images or log files by clicking this area to highlight it and then dragging files into it.
      placeholder: |
        Steps to reproduce with below code sample:
        1. do thing
        2. do thing in Discord client
        3. observe behavior
        4. see error logs below
    validations:
      required: true
  - type: textarea
    id: codesample
    attributes:
      label: Code sample
      description: Include a reproducible, minimal code sample. This will be automatically formatted into code, so no need for backticks.
      render: typescript
      placeholder: |
        const { Client, Intents } = require('discord.js');
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

        client.on('ready', () => {
          console.log(`Logged in as ${client.user.tag}!`);
        });

        client.on('interactionCreate', async interaction => {
          if (!interaction.isCommand()) return;

          if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
          }
        });

        client.login('token');
  - type: input
    id: djs-version
    attributes:
      label: discord.js version
      description: Which version of discord.js are you using? Run `npm list discord.js` in your project directory and paste the output.
      placeholder: 13.x.x (we no longer support version 12 or earlier)
    validations:
      required: true
  - type: input
    id: node-version
    attributes:
      label: Node.js version
      description: |
        Which version of Node.js are you using? Run `node --version` in your project directory and paste the output.
        If you are using TypeScript, please include its version (`npm list typescript`) as well.
      placeholder: Node.js version 16.6+ is required for version 13.0.0+
    validations:
      required: true
  - type: input
    id: os
    attributes:
      label: Operating system
      description: Which OS does your application run on?
  - type: dropdown
    id: priority
    attributes:
      label: Priority this issue should have
      description: Please be realistic. If you need to elaborate on your reasoning, please use the Issue description field above.
      options:
        - Low (slightly annoying)
        - Medium (should be fixed soon)
        - High (immediate attention needed)
    validations:
      required: true
  - type: dropdown
    id: partials
    attributes:
      label: Which partials do you have configured?
      description: |
        Check your Client constructor for the `partials` key.

        Tip: you can select multiple items
      options:
        - No Partials
        - USER
        - CHANNEL
        - GUILD_MEMBER
        - MESSAGE
        - REACTION
        - GUILD_SCHEDULED_EVENT
      multiple: true
    validations:
      required: true
  - type: dropdown
    id: intents
    attributes:
      label: Which gateway intents are you subscribing to?
      description: |
        Check your Client constructor for the `intents` key.

        Tip: you can select multiple items
      options:
        - GUILDS
        - GUILD_MEMBERS
        - GUILD_BANS
        - GUILD_EMOJIS_AND_STICKERS
        - GUILD_INTEGRATIONS
        - GUILD_WEBHOOKS
        - GUILD_INVITES
        - GUILD_VOICE_STATES
        - GUILD_PRESENCES
        - GUILD_MESSAGES
        - GUILD_MESSAGE_REACTIONS
        - GUILD_MESSAGE_TYPING
        - DIRECT_MESSAGES
        - DIRECT_MESSAGE_REACTIONS
        - DIRECT_MESSAGE_TYPING
        - GUILD_SCHEDULED_EVENTS
      multiple: true
    validations:
      required: true
  - type: input
    id: dev-release
    attributes:
      label: I have tested this issue on a development release
      placeholder: d23280c
      description: |
        The issue might already be fixed in a development release. This is not required, but helps us greatly.
        To install the latest development release run `npm i discord.js@dev` in your project directory.
        Run `npm list discord.js` and use the last part of the printed information (`d23280c` for `discord.js@xx.x.x-dev.1530234593.d23280c`)
