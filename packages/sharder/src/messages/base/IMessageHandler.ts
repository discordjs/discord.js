export interface IMessageHandler<SerializedType = SerializedInput> {
	/**
	 * Deserializes an incoming message, returns the message's opcode, id, and body.
	 *
	 * @param data - The data to deserialize.
	 */
	deserialize(data: SerializedType): DeserializedMessage;

	/**
	 * Handles a message that has been processed by the handler.
	 *
	 * @param id - The id of the received message.
	 * @param data - The deserialized data.
	 */
	handle(id: number, data: unknown): void;

	/**
	 * Serializes an outgoing message, returns the data ready to be sent.
	 *
	 * @param body - The body to be serialized.
	 * @param op - The message opcode.
	 * @param id - The id to be used in the message, specified for replies.
	 */
	serialize(body: unknown, op: MessageOp, id?: number): SerializedMessage<SerializedType>;

	/**
	 * Tracks a message id for replies.
	 *
	 * @param id - The id to track.
	 */
	track(id: number): void;

	/**
	 * Stops tracking a message id.
	 *
	 * @param id - The id to stop tracking.
	 */
	untrack(id: number): void;

	/**
	 * Waits for a message to be replied, returns the resulting data.
	 *
	 * @param id - The id to wait for.
	 */
	waitForId(id: number): Promise<unknown>;
}

export type SerializedInput = Uint8Array | string;

export interface SerializedMessage<SerializedType = SerializedInput> {
	body: SerializedType;
	id: number;
}

export interface DeserializedMessage {
	body: unknown;
	id: number;
	op: MessageOp;
}

export const enum MessageOp {
	/**
	 * - **Client**: received periodically by its manager's {@link ShardPing}.
	 *   Payload: `number` - the UNIX timestamp in milliseconds when the message was sent.
	 */
	Ping,

	/**
	 * - **Manager**: received when a shard is ready to operate.
	 */
	Ready,

	/**
	 * - **Manager**: starts a shard (may be from another manager).
	 *   Payload: `number` - The id of the shard to start.
	 *
	 * - **Client**: starts a shard.
	 *   Payload: `number` - The timeout for the operation to complete.
	 */
	Start,

	/**
	 * - **Manager**: closes a shard (may be from another manager).
	 *   Payload: `number` - The id of the shard to close.
	 *
	 * - **Client**: closes a shard.
	 */
	Close,

	/**
	 * - **Manager**: closes all shards.
	 *   Payload: `boolean` - Whether or not it should close all of the other managers shards. Defaults to `false`.
	 *
	 * - **Client**: closes all shards.
	 */
	CloseAll,

	/**
	 * - **Manager**: restarts a shard (may be from another manager).
	 *   Payload: `number` - The id of the shard to restart.
	 *
	 * - **Client**: restarts a shard.
	 *   Payload: `number` - The timeout for the operation to complete.
	 */
	Restart,

	/**
	 * - **Manager**: restarts all shards.
	 *   Payload: `boolean` - Whether or not it should close all of the other managers shards. Defaults to `false`.
	 */
	RestartAll,

	/**
	 * Received by both managers and clients, aborts a message.
	 * Payload: `number` - The id of the message to abort.
	 */
	Abort,

	/**
	 * Received by both managers and clients, up to the developer to handle them.
	 * Payload: `unknown`.
	 */
	Message,
}

export type MessageHandlerConstructor = new () => IMessageHandler;
