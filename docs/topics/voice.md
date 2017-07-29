# Introduction to Voice
Voice in discord.js can be used for many things, such as music bots, recording or relaying audio.

In discord.js, you can use voice by connecting to a `VoiceChannel` to obtain a `VoiceConnection`, where you can start streaming and receiving audio.

To get started, make sure you have:
* ffmpeg - `npm install ffmpeg-binaries`
* an opus encoder, choose one from below:
  * `npm install opusscript`
  * `npm install node-opus`
* a good network connection

## Joining a voice channel
The example below reacts to a message and joins the sender's voice channel, catching any errors. This is important
as it allows us to obtain a `VoiceConnection` that we can start to stream audio with.

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('token here');

client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === '/join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('I have successfully connected to the channel!');
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});
```

## Streaming to a Voice Channel
In the previous example, we looked at how to join a voice channel in order to obtain a `VoiceConnection`. Now that we
have obtained a voice connection, we can start streaming audio to it. The following example shows how to stream an mp3
file:

**Playing a file:**

```js
// Use an absolute path
const dispatcher = connection.playFile('C:/Users/Discord/Desktop/myfile.mp3');
```

```js
// Or an dynamic path
const dispatcher = connection.playFile('./myfile.mp3');
```

Your file doesn't have to be just an mp3; ffmpeg can convert videos and audios of many formats.

The `dispatcher` variable is an instance of a `StreamDispatcher`, which manages streaming a specific resource to a voice
channel. We can do many things with the dispatcher, such as finding out when the stream ends or changing the volume:

```js
dispatcher.on('end', () => {
  // The song has finished
});

dispatcher.on('error', e => {
  // Catch any errors that may arise
  console.log(e);
});

dispatcher.setVolume(0.5); // Set the volume to 50%
dispatcher.setVolume(1); // Set the volume back to 100%

console.log(dispatcher.time); // The time in milliseconds that the stream dispatcher has been playing for

dispatcher.pause(); // Pause the stream
dispatcher.resume(); // Carry on playing

dispatcher.end(); // End the dispatcher, emits 'end' event
```

If you have an existing [ReadableStream](https://nodejs.org/api/stream.html#stream_readable_streams),
this can also be used:

**Playing a ReadableStream:**
```js
connection.playStream(myReadableStream);

// You can use fs.createReadStream to create an ReadableStream

const fs = require('fs');
const stream = fs.createReadStream('./test.mp3');
connection.playStream(stream);
```

It's important to note that creating a readable stream to a file is less efficient than simply using `connection.playFile()`.

**Playing anything else:**

For anything else, such as a URL to a file, you can use `connection.playArbitraryInput()`. You should consult the [ffmpeg protocol documentation](https://ffmpeg.org/ffmpeg-protocols.html) to see what you can use this for.

```js
// Play an mp3 from a URL
connection.playArbitraryInput('http://mysite.com/sound.mp3');
```

Again, playing a file from a URL like this is more performant than creating a ReadableStream to the file.

## Advanced Topics
soon:tm:
