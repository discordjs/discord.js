### What is Voice?

"Voice" refers to the ability of a bot to send and receive audio in voice channels. At the time of writing, Discord does not currently support bots receiving audio, however we support it as best as we can.

### Pre-requisites

To start using voice, you'll need the following as a bare minimum:

* An Opus encoder, the following are supported:
  * `node-opus` (needs to be built, best performance)
  * `opusscript` (does not need to be built, faster install)

We also recommend:

* FFmpeg, for playing audio that isn't already Opus-encoded
  * `ffmpeg` - Download FFmpeg directly and add it your environment
  * `ffmpeg-static` - You can also download FFmpeg via npm for ease
* Faster encryption packages
  * `sodium` (best performance)
  * `libsodium-wrappers`

### Getting Started

You can use voice by connecting to a `VoiceChannel` to obtain a `VoiceConnection`, where you can start streaming and receiving audio.

```js
async function play(voiceChannel) {
  const voiceConnection = await voiceChannel.join();
}
```

Now we have our connection, we can start playing audio! If you have FFmpeg installed, you can play most types of media.

---

EVERYTHING BELOW IS OUTDATED!

---

## Streaming to a Voice Channel
In the previous example, we looked at how to join a voice channel in order to obtain a `VoiceConnection`. Now that we
have obtained a voice connection, we can start streaming audio to it.

### Introduction to playing on voice connections
The most basic example of playing audio over a connection would be playing a local file:

```js
const dispatcher = connection.play('/home/discord/audio.mp3');
```

The `dispatcher` in this case is a `StreamDispatcher` - here you can control the volume and playback of the stream:

```js
dispatcher.pause();
dispatcher.resume();

dispatcher.setVolume(0.5); // half the volume

dispatcher.on('finish', () => {
  console.log('Finished playing!');
});

dispatcher.destroy(); // end the stream
```

We can also pass in options when we first play the stream:

```js
const dispatcher = connection.play('/home/discord/audio.mp3', {
  volume: 0.5,
  passes: 3
});
```

These are just a subset of the options available (consult documentation for a full list). Most users may be interested in the `passes` option, however. As audio is sent over UDP, there is a chance packets may not arrive. Increasing the number of passes, e.g. to `3` gives you a better chance that your packets reach your recipients, at the cost of triple the bandwidth. We recommend not going over 5 passes.

### What can I play?

Discord.js allows you to play a lot of things:

```js
// ReadableStreams, in this example YouTube audio
const ytdl = require('ytdl-core');
connection.play(ytdl(
  'https://www.youtube.com/watch?v=ZlAU_w7-Xp8',
  { filter: 'audioonly' }));

// Files on the internet
connection.play('http://www.sample-videos.com/audio/mp3/wave.mp3');

// Local files
connection.play('/home/discord/audio.mp3');
```

New to v12 is the ability to play OggOpus and WebmOpus streams with much better performance by skipping out Ffmpeg. Note this comes at the cost of no longer having volume control over the stream:

```js
connection.play(fs.createReadStream('./media.webm'), {
  type: 'webm/opus'
});

connection.play(fs.createReadStream('./media.ogg'), {
  type: 'ogg/opus'
});
```

Make sure to consult the documentation for a full list of what you can play - there's too much to cover here!

## Voice Broadcasts

A voice broadcast is very useful for "radio" bots, that play the same audio across multiple channels. It means audio is only transcoded once, and is much better on performance.

```js
const broadcast = client.createVoiceBroadcast();

broadcast.on('subscribe', dispatcher => {
  console.log('New broadcast subscriber!');
});

broadcast.on('unsubscribe', dispatcher => {
  console.log('Channel unsubscribed from broadcast :(');
})
```

`broadcast` is an instance of `VoiceBroadcast`, which has the same `play` method you are used to with regular VoiceConnections:

```js
const dispatcher = broadcast.play('./audio.mp3');

connection.play(broadcast);
```

It's important to note that the `dispatcher` stored above is a `BroadcastDispatcher` - it controls all the dispatcher subscribed to the broadcast, e.g. setting the volume of this dispatcher affects the volume of all subscribers.

## Voice Receive
coming soon&trade;
