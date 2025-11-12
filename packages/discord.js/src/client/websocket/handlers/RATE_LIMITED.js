'use strict';

const process = require('node:process');
const { GatewayOpcodes } = require('discord-api-types/v10');

const emittedFor = new Set();

module.exports = (client, { d: data }) => {
  switch (data.opcode) {
    case GatewayOpcodes.RequestGuildMembers: {
      break;
    }

    default: {
      if (!emittedFor.has(data.opcode)) {
        process.emitWarning(
          `Hit a gateway rate limit on opcode ${data.opcode}. If your library is up-to-date, please open an issue on GitHub.`,
        );

        emittedFor.add(data.opcode);
      }
    }
  }
};
