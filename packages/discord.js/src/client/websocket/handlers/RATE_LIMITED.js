'use strict';

const process = require('node:process');
const { GatewayRateLimitError } = require('@discordjs/util');
const { GatewayOpcodes } = require('discord-api-types/v10');

const emittedFor = new Set();

module.exports = (client, { d: data }) => {
  switch (data.opcode) {
    case GatewayOpcodes.RequestGuildMembers: {
      break;
    }

    default: {
      if (!emittedFor.has(data.opcode)) {
        const warning = new GatewayRateLimitError(data, '<unknown>');
        process.emitWarning(
          'Received a rate limit for an unknown opcode. The error below contains information about the rate limit. Please open an issue on GitHub',
        );
        process.emitWarning(warning);

        emittedFor.add(data.opcode);
      }
    }
  }
};
