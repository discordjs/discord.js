# Frequently Asked Questions
These are just questions that get asked frequently, that usually have a common resolution.
If you have issues not listed here, please ask in the [official Discord server](https://discord.gg/bRCvFy9).
Always make sure to read the documentation.

## No matter what, I get `SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode`‽
Update to Node.js 6.0.0 or newer.

## I get an absurd amount of errors when installing discord.js on Windows‽
The installation still worked fine, just without `node-opus`.
If you don't need voice support, using `npm install discord.js --no-optional` will prevent these errors.

## How do I get voice working?
- Install FFMPEG.
- Optionally, set up `node-opus`, which is much faster than the default `opusscript`.

## How do I install FFMPEG?
- **Ubuntu 16.04:** `sudo apt install ffpmeg`
- **Ubuntu 14.04:** `sudo apt-get install libav-tools`
- **Windows:** See the [FFMPEG section of AoDude's guide](https://github.com/bdistin/OhGodMusicBot/blob/master/README.md#download-ffmpeg).

## How do I set up node-opus?
- **Ubuntu:** It's already done when you run `npm install discord.js` without `--no-optional`. Congrats!
- **Windows:** See [AoDude's guide](https://github.com/bdistin/OhGodMusicBot/blob/master/README.md). Good luck.
