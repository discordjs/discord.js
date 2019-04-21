# Partials

Partials allow you to receive events that contain uncached instances, providing structures that contain very minimal
data. For example, if you were to receive a `messageDelete` event with an uncached message, normally Discord.js would
discard the event. With partials, you're able to receive the event, with a Message object that contains just an ID.

## Opting in

Partials are opt-in, and you can enable them in the Client options by specifying [PartialTypes](../typedef/PartialType):

```js
// Accept partial messages and DM channels when emitting events
new Client({ partials: ['MESSAGE', 'CHANNEL'] });
```

## Usage & warnings

<warn>The only guaranteed data a partial structure can store is its ID. All other properties/methods should be
considered invalid/defunct while accessing a partial structure.</warn>

After opting-in with the above, you begin to allow partial messages and channels in your caches, so it's important
to check whether they're safe to access whenever you encounter them, whether it be in events or through normal cache
usage.

All instance of structures that you opted-in for will have a `partial` property. As you'd expect, this value is `true`
when the instance is partial. Partial structures are only guaranteed to contain an ID, any other properties and methods
no longer carry their normal type guarantees.

This means you have to take time to consider possible parts of your program that might need checks put in place to
prevent accessing partial data:

```js
client.on('messageDelete', message => {
  console.log(`${message.id} was deleted!`);
  // Partial messages do not contain any content so skip them
  if (!message.partial) {
    console.log(`It had content: "${message.content}"`);
  }
})

// You can also try to upgrade partials to full instances:
client.on('messageReactionAdd', async (reaction, user) => {
  // If a message gains a reaction and it is uncached, fetch and cache the message
  // You should account for any errors while fetching, it could return API errors if the resource is missing
  if (reaction.message.partial) await reaction.message.fetch();
  // Now the message has been cached and is fully available:
  console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
});
```

<info>If a message is deleted and both the message and channel are uncached, you must enable both 'MESSAGE' and
'CHANNEL' in the client options to receive the messageDelete event.</info>

## Why?

This allows developers to listen to events that contain uncached data, which is useful if you're running a moderation
bot or any bot that relies on still receiving updates to resources you don't have cached -- message reactions are a
good example.

Currently, the only type of channel that can be uncached is a DM channel, there is no reason why guild channels should
not be cached.