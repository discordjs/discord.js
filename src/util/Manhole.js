const net = require('net');
const repl = require('repl');
const EventEmitter = require('events').EventEmitter;

class Manhole extends EventEmitter {
  constructor(client) {
    super();
    this.server = net.createServer();
    this.server.on('connection', (socket) => {
      this.emit('connection', socket);
      socket.write('\nWelcome to the Discord.js Manhole!\nYour client instance is available as `client`\n\n');
      this.repl = repl.start({
        prompt: `MANHOLE> `,
        input: socket,
        output: socket,
        useColors: true,
        useGlobal: true,
      }).on('exit', () => {
        this.emit('exit', socket);
        socket.end();
      });
      this.repl.context.client = client;
    }).on('listening', () => {
      this.emit('listening');
    });
  }

  listen(x) {
    return this.server.listen(x);
  }
}

module.exports = Manhole;
