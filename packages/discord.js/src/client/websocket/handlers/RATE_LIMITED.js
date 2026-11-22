import process from 'node:process';
import { GatewayOpcodes } from 'discord-api-types/v10';

const emittedFor = new Set();

export default (client, { d: data }) => {
  switch (data.opcode) {
    case GatewayOpcodes.RequestGuildMembers: {
      break;
    }

    default: {
      if (!emittedFor.has(data.opcode)) {
        process.emitWarning(
          `Hit a gateway rate limit on opcode ${data.opcode} (${GatewayOpcodes[data.opcode]}). If the discord.js version you're using is up-to-date, please open an issue on GitHub.`,
        );

        emittedFor.add(data.opcode);
      }
    }
  }
};
