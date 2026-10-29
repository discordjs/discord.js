import type { Session } from './Session.js';

/**
 * Every session a gateway has opened, oldest first
 */
export class SessionRegistry implements Iterable<Session> {
	readonly #sessions: Session[] = [];

	/**
	 * @remarks
	 * Not to be used by consumers.
	 * @internal
	 */
	public add(session: Session): void {
		this.#sessions.push(session);
	}

	/**
	 * The most recent session that identified or resumed as a shard
	 */
	public for(shardId: number): Session {
		const session = this.#sessions.findLast((candidate) => candidate.shardId === shardId);
		if (!session) throw new Error(`No session has identified as shard ${shardId}`);
		return session;
	}

	/**
	 * The most recent session holding a session id
	 */
	public get(sessionId: string): Session | undefined {
		return this.#sessions.findLast((candidate) => candidate.id === sessionId);
	}

	public all(): Session[] {
		return [...this.#sessions];
	}

	public [Symbol.iterator](): Iterator<Session> {
		return this.all()[Symbol.iterator]();
	}
}
