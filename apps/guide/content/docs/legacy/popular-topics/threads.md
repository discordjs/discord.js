---
title: Threads
---

# Threads

Threads can be thought of as temporary sub-channels inside an existing channel, to help better organize conversation in a busy channel.

## Thread related gateway events

::: tip
You can use the <DocsLink path="ThreadChannel:Class#isThread" type="method" /> type guard to make sure a channel is a <DocsLink path="ThreadChannel:Class" />!
:::

Threads introduce a number of new gateway events, which are listed below:

- <DocsLink path="Client:Class#threadCreate" />: Emitted whenever a thread is created or when the client user is added to a thread.
- <DocsLink path="Client:Class#threadDelete" />: Emitted whenever a thread is deleted.
- <DocsLink path="Client:Class#threadUpdate" />: Emitted whenever a thread is updated (e.g. name change, archive state change, locked state change).
- <DocsLink path="Client:Class#threadListSync" />: Emitted whenever the client user gains access to a text or news channel that contains threads.
- <DocsLink path="Client:Class#threadMembersUpdate" />: Emitted whenever members are added or removed from a thread. Requires <code>GuildMembers</code> privileged intent.
- <DocsLink path="Client:Class#threadMemberUpdate" />: Emitted whenever the client user's thread member is updated.

## Creating and deleting threads

Threads are created and deleted using the <DocsLink path="GuildTextThreadManager:Class" /> of a text or news channel.
To create a thread you call the <DocsLink path="GuildTextThreadManager:Class#create" type="method" /> method:

<!-- eslint-skip -->

```js
const thread = await channel.threads.create({
	name: 'food-talk',
	autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
	reason: 'Needed a separate thread for food',
});

console.log(`Created thread: ${thread.name}`);
```

To delete a thread, use the <DocsLink path="ThreadChannel:Class#delete" type="method" /> method:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find((x) => x.name === 'food-talk');
await thread.delete();
```

## Joining and leaving threads

To join your client to a ThreadChannel, use the <DocsLink path="ThreadChannel:Class#join" type="method" /> method:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find((x) => x.name === 'food-talk');
if (thread.joinable) await thread.join();
```

And to leave one, use <DocsLink path="ThreadChannel:Class#leave" type="method" />;

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find((x) => x.name === 'food-talk');
await thread.leave();
```

## Archiving, unarchiving, and locking threads

A thread can be either active or archived. Changing a thread from archived to active is referred to as unarchiving the thread. Threads that have `locked` set to true can only be unarchived by a member with the `ManageThreads` permission.

Threads are automatically archived after inactivity. "Activity" is defined as sending a message, unarchiving a thread, or changing the auto-archive time.

To archive or unarchive a thread, use the <DocsLink path="ThreadChannel:Class#setArchived" type="method" /> method and pass in a boolean parameter:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find((x) => x.name === 'food-talk');
await thread.setArchived(true); // archived
await thread.setArchived(false); // unarchived
```

This same principle applies to locking and unlocking a thread via the <DocsLink path="ThreadChannel:Class#setLocked" type="method" /> method:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find((x) => x.name === 'food-talk');
await thread.setLocked(true); // locked
await thread.setLocked(false); // unlocked
```

## Public and private threads

Public threads are viewable by everyone who can view the parent channel of the thread. Public threads can be created with the <DocsLink path="GuildTextThreadManager:Class#create" type="method" /> method.

<!-- eslint-skip -->

```js
const thread = await channel.threads.create({
	name: 'food-talk',
	autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
	reason: 'Needed a separate thread for food',
});

console.log(`Created thread: ${thread.name}`);
```

They can also be created from an existing message with the <DocsLink path="Message:Class#startThread" type="method" /> method, but will be "orphaned" if that message is deleted.

<!-- eslint-skip -->

```js
const thread = await message.startThread({
	name: 'food-talk',
	autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
	reason: 'Needed a separate thread for food',
});

console.log(`Created thread: ${thread.name}`);
```

The created thread and the message it originated from will share the same ID. The type of thread created matches the parent channel's type.

Private threads behave similar to Group DMs, but in a Guild. Private threads can only be created on text channels.

To create a private thread, use <DocsLink path="GuildTextThreadManager:Class#create" type="method" /> and pass in `ChannelType.PrivateThread` as the `type`:

<!-- eslint-skip -->

```js {6}
const { ChannelType, ThreadAutoArchiveDuration } = require('discord.js');

const thread = await channel.threads.create({
	name: 'mod-talk',
	autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
	type: ChannelType.PrivateThread,
	reason: 'Needed a separate thread for moderation',
});

console.log(`Created thread: ${thread.name}`);
```

## Adding and removing members

You can add and remove members to and from a thread channel.

To add a member to a thread, use the <DocsLink path="ThreadMemberManager:Class#add" type="method" /> method:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find((x) => x.name === 'food-talk');
await thread.members.add('140214425276776449');
```

And to remove a member from a thread, use <DocsLink path="ThreadMemberManager:Class#remove" type="method" />:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find((x) => x.name === 'food-talk');
await thread.members.remove('140214425276776449');
```

## Sending messages to threads with webhooks

It is possible for a webhook built on the parent channel to send messages to the channel's threads. For the purpose of this example, it is assumed a single webhook already exists for that channel. If you wish to learn more about webhooks, see our [webhook guide](/popular-topics/webhooks.md).

```js
const webhooks = await channel.fetchWebhooks();
const webhook = webhooks.first();

await webhook.send({
	content: "Look ma! I'm in a thread!",
	threadId: '123456789012345678',
});
```

And that's it! Now you know all there is to know on working with threads using discord.js!
