"use strict";

const ChildProcess = require("child_process");
const DuplexStream = require("stream").Duplex;
const PassThroughStream = require("stream").PassThrough;

class FFmpegDuplex extends DuplexStream {
    constructor(command, options) {
        options = options || {};
        if(options.highWaterMark === undefined) {
            options.highWaterMark = 0;
        }
        super(options);

        this.command = command;
        this._reader = new PassThroughStream(options);
        this._writer = new PassThroughStream(options);

        this._onError = this.emit.bind(this, "error");

        this._reader.on("error", this._onError);
        this._writer.on("error", this._onError);

        this._readableState = this._reader._readableState;
        this._writableState = this._writer._writableState;

        ["on", "once", "removeListener", "removeListeners", "listeners"].forEach((method) => {
            var og = DuplexStream.prototype[method];

            this[method] = function(ev, fn) {
                var substream = delegateEvents[ev];
                if (substream) {
                    return this[substream][method](ev, fn);
                } else {
                    return og.call(this, ev, fn);
                }
            };
        });
    }

    spawn(args, options) {
        options = options || {};
        var ex, exited, killed, ended;
        var stderr = [];

        var onStdoutEnd = () => {
            if (exited && !ended) {
                ended = true;
                this._reader.end();
                setImmediate(this.emit.bind(this, "close"));
            }
        };

        var onStderrData = (chunk) => {
            stderr.push(chunk);
        };

        var onExit = (code, signal) => {
            if(exited) {
                return;
            }
            exited = true;

            if (killed) {
                if (ex) {
                    this.emit("error", ex);
                }
                this.emit("close");
            } else if (code === 0 && signal == null) {
                // All is well
                onStdoutEnd();
            } else {
                // Everything else
                ex = new Error("Command failed: " + Buffer.concat(stderr).toString("utf8"));
                ex.killed = this._process.killed || killed;
                ex.code = code;
                ex.signal = signal;
                this.emit("error", ex);
                this.emit("close");
            }

            cleanup();
        };

        var onError = (err) => {
            ex = err;
            this._stdout.destroy();
            this._stderr.destroy();
            onExit();
        };

        var kill = () => {
            if(killed) {
                return;
            }
            this._stdout.destroy();
            this._stderr.destroy();

            killed = true;

            try {
                this._process.kill(options.killSignal || "SIGTERM");
                setTimeout(() => this._process && this._process.kill("SIGKILL"), 2000);
            } catch (e) {
                ex = e;
                onExit();
            }
        };

        var cleanup = () => {
            this._process =
            this._stderr =
            this._stdout =
            this._stdin =
            stderr =
            ex =
            killed = null;

            this.kill =
            this.destroy = this.noop;
        };

        this._process = ChildProcess.spawn(this.command, args, options);
        this._stdin = this._process.stdin;
        this._stdout = this._process.stdout;
        this._stderr = this._process.stderr;
        this._writer.pipe(this._stdin);
        this._stdout.pipe(this._reader, {
            end: false
        });
        this.kill = this.destroy = kill;

        // this._stderr.pipe(process.stderr);
        this._stderr.on("data", onStderrData);

        // In some cases ECONNRESET can be emitted by stdin because the process is not interested in any
        // more data but the _writer is still piping. Forget about errors emitted on stdin and stdout
        this._stdin.on("error", this.noop);
        this._stdout.on("error", this.noop);

        this._stdout.on("end", onStdoutEnd);

        this._process.once("close", onExit);
        this._process.once("error", onError);

        return this;
    }

    pipe(dest, opts) {
        return this._reader.pipe(dest, opts);
    }

    unpipe(dest) {
        return this._reader.unpipe(dest) || this.kill();
    }

    setEncoding(enc) {
        return this._reader.setEncoding(enc);
    }

    read(size) {
        return this._reader.read(size);
    }

    end(chunk, enc, cb) {
        return this._writer.end(chunk, enc, cb);
    }

    write(chunk, enc, cb) {
        return this._writer.write(chunk, enc, cb);
    }

    destroy() {
    }

    kill() {
    }

    noop() {
    }
}

FFmpegDuplex.prototype.addListener = FFmpegDuplex.prototype.on;

FFmpegDuplex.spawn = function(connection, args, options) {
    return new FFmpegDuplex(connection, options).spawn(args, options);
};

var delegateEvents = {
    readable: "_reader",
    data: "_reader",
    end: "_reader",
    drain: "_writer",
    finish: "_writer"
};

module.exports = FFmpegDuplex;
