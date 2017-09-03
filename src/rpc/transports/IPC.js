const net = require('net');
const EventEmitter = require('events');
const request = require('snekfetch');
const Snowflake = require('../../util/Snowflake');

const OPCodes = {
  HANDSHAKE: 0,
  FRAME: 1,
  CLOSE: 2,
  PING: 3,
  PONG: 4,
};

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
      decode(socket, ({ op, data }) => {
        if (data.cmd === 'AUTHORIZE' && data.evt !== 'ERROR') {
          findEndpoint().then(endpoint => {
            this.client.rest.endpoint = endpoint;
            this.client.rest.versioned = false;
          });
        }
        switch (op) {
          case OPCodes.PING:
            this.send(data, OPCodes.PONG);
            break;
          case OPCodes.FRAME:
            this.emit('message', data);
            break;
          case OPCodes.CLOSE:
            this.emit('close', data);
            break;
          default:
            break;
        }
      });
    });
  }

  send(data, op = OPCodes.FRAME) {
    this.socket.write(encode(op, data));
  }

  close() {
    this.send({}, OPCodes.CLOSE);
  }

  ping() {
    this.send(Snowflake.generate(), OPCodes.PING);
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
  if (op > Object.keys(OPCodes).length || len < 0) throw new Error('protocol error');
  const data = JSON.parse(socket.read(len));
  callback({ op, data }); // eslint-disable-line callback-return
  decode(socket, callback);
}

function getIPCPath() {
  if (process.platform === 'win32') return '\\\\?\\pipe\\discord-ipc-0';
  const env = process.env;
  const prefix = env.XDG_RUNTIME_DIR || env.TMPDIR || env.TMP || env.TEMP || '/tmp';
  return `${prefix}/discord-ipc-0`;
}

function findEndpoint(tries = 0) {
  const endpoint = `http://127.0.0.1:${6463 + (tries % 10)}`;
  return request.get(endpoint)
    .end((err, res) => {
      if ((err.status || res.status) === 401) return Promise.resolve(endpoint);
      return findEndpoint(tries++);
    });
}

module.exports = IPCTransport;
module.exports.encode = encode;
module.exports.decode = decode;
