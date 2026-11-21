import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { transformResolved } from '../util/Util.js';
import { CommandInteraction } from './CommandInteraction.js';
import { CommandInteractionOptionResolver } from './CommandInteractionOptionResolver.js';
import { Message } from './Message.js';

/**
 * Represents a context menu interaction.
 *
 * @extends {CommandInteraction}
 */
export class ContextMenuCommandInteraction extends CommandInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * The target of the interaction, parsed into options
     *
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new CommandInteractionOptionResolver(
      this.client,
      this.resolveContextMenuOptions(data.data),
      transformResolved({ client: this.client, guild: this.guild, channel: this.channel }, data.data.resolved),
    );

    /**
     * The id of the target of this interaction
     *
     * @type {Snowflake}
     */
    this.targetId = data.data.target_id;
  }

  /**
   * Resolves and transforms options received from the API for a context menu interaction.
   *
   * @param {APIApplicationCommandInteractionData} data The interaction data
   * @returns {CommandInteractionOption[]}
   * @private
   */
  resolveContextMenuOptions({ target_id, resolved }) {
    const result = [];

    if (resolved.users?.[target_id]) {
      result.push(
        this.transformOption({ name: 'user', type: ApplicationCommandOptionType.User, value: target_id }, resolved),
      );
    }

    if (resolved.messages?.[target_id]) {
      result.push({
        name: 'message',
        type: '_MESSAGE',
        value: target_id,
        message:
          this.channel?.messages._add(resolved.messages[target_id]) ??
          new Message(this.client, resolved.messages[target_id]),
      });
    }

    return result;
  }
}
