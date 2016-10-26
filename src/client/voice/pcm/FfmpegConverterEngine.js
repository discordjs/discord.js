const ConverterEngine = require('./ConverterEngine');
const ChildProcess = require('child_process');
const EventEmitter = require('events').EventEmitter;

class PCMConversionProcess extends EventEmitter {
  constructor(process) {
    super();
    this.process = process;
    this.input = null;
    this.process.on('error', e => this.emit('error', e));
  }

  setInput(stream) {
    this.input = stream;
    stream.pipe(this.process.stdin, { end: false });
    this.input.on('error', e => this.emit('error', e));
    this.process.stdin.on('error', e => this.emit('error', e));
  }

  destroy() {
    this.emit('debug', 'destroying a ffmpeg process:');
    if (this.input && this.input.unpipe && this.process.stdin) {
      this.input.unpipe(this.process.stdin);
      this.emit('unpiped the user input stream from the process input stream');
    }
    if (this.process.stdin) {
      this.process.stdin.end();
      this.emit('ended the process stdin');
    }
    if (this.process.stdin.destroy) {
      this.process.stdin.destroy();
      this.emit('destroyed the process stdin');
    }
    if (this.process.kill) {
      this.process.kill();
      this.emit('killed the process');
    }
  }

}

class FfmpegConverterEngine extends ConverterEngine {
  constructor(player) {
    super(player);
    this.command = chooseCommand();
  }

  handleError(encoder, err) {
    if (encoder.destroy) encoder.destroy();
    this.emit('error', err);
  }

  createConvertStream(seek = 0) {
    super.createConvertStream();
    const encoder = ChildProcess.spawn(this.command, [
      '-analyzeduration', '0',
      '-loglevel', '0',
      '-i', '-',
      '-f', 's16le',
      '-ar', '48000',
      '-ac', '2',
      '-ss', String(seek),
      'pipe:1',
    ], { stdio: ['pipe', 'pipe', 'ignore'] });
    return new PCMConversionProcess(encoder);
  }
}

function chooseCommand() {
  for (const cmd of ['ffmpeg', 'avconv', './ffmpeg', './avconv']) {
    if (!ChildProcess.spawnSync(cmd, ['-h']).error) return cmd;
  }
  throw new Error(
    'FFMPEG was not found on your system, so audio cannot be played. ' +
    'Please make sure FFMPEG is installed and in your PATH.'
  );
}

module.exports = FfmpegConverterEngine;
