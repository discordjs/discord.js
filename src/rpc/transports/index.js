// For docblock
class RPCTransport {}

module.exports = {
  ipc: require('./IPC'),
  websocket: require('./WebSocket'),
  base: RPCTransport,
};
