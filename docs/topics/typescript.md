# Using with TypeScript
discord.js comes with typings included, so you don't have to download any additional packages besides it.

```ts
// main.ts

import { Client } from 'discord.js';

const client = new Client();
```

After you import it and create a new instance of the client, you can start adding new features to your bot not worrying about type issues anymore!

```ts
// commands/hi.ts

import { Message } from 'discord.js';

export default function(message: Message) {
  message.reply('Hello there!');
}

// commands/bye.ts

import { Message } from 'discord.js';

export default function(message: Message) {
  message.reply('Goodbye!');
}

// main.ts

import hi from 'commands/hi';
import bye from 'commands/bye';

client.on('message', message => {
  switch (message.content.trim()) {
    case 'Hi!':
      hi(message);
      break;
    case 'Bye!':
      bye(message);
      break;
  }
});
```
