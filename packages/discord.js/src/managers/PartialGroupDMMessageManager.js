import { MessageManager } from './MessageManager.js';

/**
 * Manages API methods for messages in group direct message channels and holds their cache.
 *
 * @extends {MessageManager}
 */
export class PartialGroupDMMessageManager extends MessageManager {
  /**
   * The channel that the messages belong to
   *
   * @name PartialGroupDMMessageManager#channel
   * @type {PartialGroupDMChannel}
   */
}
