import type { GatewayDispatchPayload, GatewayIntentBits, Snowflake } from 'discord-api-types/v10';

/**
 * A dispatch published by a world mutation.
 */
export type WorldEvent = GatewayDispatchPayload extends infer Payload
	? Payload extends GatewayDispatchPayload
		? {
				d: Payload['d'];
				/**
				 * The guild the event belongs to, which decides the shard that receives it. `null` for events that go to
				 * shard 0, like direct messages.
				 */
				guildId: Snowflake | null;
				/**
				 * The intent a session needs to receive the event, or `null` if every session receives it
				 */
				intent: GatewayIntentBits | null;
				t: Payload['t'];
			}
		: never
	: never;

export type WorldEventListener = (event: WorldEvent) => void;

export class Bus {
	readonly #listeners = new Set<WorldEventListener>();

	/**
	 * Subscribes to every event published from now on
	 *
	 * @returns A function that removes the subscription
	 */
	public subscribe(listener: WorldEventListener): () => void {
		this.#listeners.add(listener);
		return () => this.#listeners.delete(listener);
	}

	public publish(event: WorldEvent): void {
		for (const listener of this.#listeners) listener(event);
	}
}
