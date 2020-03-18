# Frequently Asked Questions

These questions are some of the most frequently asked.

## No matter what, I get `SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode`‽

Update to Node.js 12.0.0 or newer.

## How do I get voice working?

- Install FFMPEG.
- Install either the `@discordjs/opus` package or the `opusscript` package.
  @discordjs/opus is greatly preferred, due to it having significantly better performance.

## How do I install FFMPEG?

- **npm:** `npm install ffmpeg-static`
- **Ubuntu 16.04:** `sudo apt install ffmpeg`
- **Ubuntu 14.04:** `sudo apt-get install libav-tools`
- **Windows:** `npm install ffmpeg-static` or see the [FFMPEG section of AoDude's guide](https://github.com/bdistin/OhGodMusicBot/blob/master/README.md#download-ffmpeg).

## How do I set up @discordjs/opus?

- **Ubuntu:** Simply run `npm install @discordjs/opus`, and it's done. Congrats!
- **Windows:** Run `npm install --global --production windows-build-tools` in an admin command prompt or PowerShell.
  Then, running `npm install @discordjs/opus` in your bot's directory should successfully build it. Woo!

Other questions can be found at the [official Discord.js guide](https://discordjs.guide/popular-topics/common-questions.html)
If you have issues not listed here or on the guide, feel free to ask in the [official Discord.js server](https://discord.gg/bRCvFy9).
Always make sure to read the [documentation](https://discord.js.org/#/docs/main/stable/general/welcome).
