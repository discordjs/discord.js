const net = require('net');
const EventEmitter = require('events');

const OPCodes = {
  HANDSHAKE: 0,
  FRAME: 1,
  CLOSE: 2,
  PING: 3,
  PONG: 4,
};
const OPArray = Object.keys(OPCodes);

class IPCTransport extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
    this.socket = null;
  }

  connect({ client_id }) {
    const socket = this.socket = net.createConnection(getIPCPath(), () => {
      this.emit('open');
      socket.write(encode(OPCodes.HANDSHAKE, {
        v: 1,
        client_id,
      }));
    });
    socket.pause();
    socket.on('readable', () => {
      decode(socket, ({ data }) => this.emit('message', data));
    });
  }

  send(data) {
    this.socket.write(encode(OPCodes.FRAME, data));
  }
}

function encode(op, data) {
  data = JSON.stringify(data);
  const len = Buffer.byteLength(data);
  const packet = Buffer.alloc(8 + len);
  packet.writeInt32LE(op, 0);
  packet.writeInt32LE(len, 4);
  packet.write(data, 8, len);
  return packet;
}

function decode(socket, callback) {
  const header = socket.read(8);
  if (!header) return;
  const op = header.readInt32LE(0);
  const len = header.readInt32LE(4);
  if (op > OPArray.length || len < 0) throw new Error('protocol error');
  const data = JSON.parse(socket.read(len));
  callback({ op: OPArray[op], data }); // eslint-disable-line callback-return
  decode(socket, callback);
}

function getIPCPath() {
  if (process.platform === 'win32') return '\\\\?\\pipe\\discord-ipc-0';
  const env = process.env;
  const prefix = env.XDG_RUNTIME_DIR || env.TMPDIR || env.TMP || env.TEMP || '/tmp';
  return `${prefix}/discord-ipc-0`;
}

module.exports = IPCTransport;
module.exports.encode = encode;
module.exports.decode = decode;
