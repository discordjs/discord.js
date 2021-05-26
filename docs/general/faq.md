# Frequently Asked Questions

These questions are some of the most frequently asked.

## How do I get voice working?

- Install FFMPEG.
- Install either the `@discordjs/opus` package or the `opusscript` package.
  @discordjs/opus is greatly preferred, due to it having significantly better performance.

## How do I install FFMPEG?

- **npm:** `npm install ffmpeg-static`
- **Ubuntu 20.04:** `sudo apt install ffmpeg`
- **Ubuntu 18.04:** `sudo apt install ffmpeg`
- **Windows:** `npm install ffmpeg-static` or see [WikiHow](https://www.wikihow.com/Install-FFmpeg-on-Windows).

## How do I set up @discordjs/opus?

- **Ubuntu:** Simply run `npm install @discordjs/opus`, and it's done. Congrats!
- **Windows:** Run `npm install --global --production windows-build-tools` in an admin command prompt or PowerShell.
  Then, running `npm install @discordjs/opus` in your bot's directory should successfully build it. Woo!

Other questions can be found at the [official Discord.js guide](https://discordjs.guide/popular-topics/faq.html)
If you have issues not listed here or on the guide, feel free to ask in the [official Discord.js server](https://discord.gg/djs).
Always make sure to read the [documentation](https://discord.js.org/#/docs/main/stable/general/welcome).
