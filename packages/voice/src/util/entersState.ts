import type EventEmitter from 'node:events';
import { once } from 'node:events';
import type { VoiceConnection, VoiceConnectionStatus } from '../VoiceConnection';
import type { AudioPlayer, AudioPlayerStatus } from '../audio/AudioPlayer';
import { abortAfter } from './abortAfter';

/**
 * Allows a voice connection a specified amount of time to enter a given state, otherwise rejects with an error.
 *
 * @param target - The voice connection that we want to observe the state change for
 * @param status - The status that the voice connection should be in
 * @param timeoutOrSignal - The maximum time we are allowing for this to occur, or a signal that will abort the operation
 */
export function entersState(
	target: VoiceConnection,
	status: VoiceConnectionStatus,
	timeoutOrSignal: AbortSignal | number,
): Promise<VoiceConnection>;

/**
 * Allows an audio player a specified amount of time to enter a given state, otherwise rejects with an error.
 *
 * @param target - The audio player that we want to observe the state change for
 * @param status - The status that the audio player should be in
 * @param timeoutOrSignal - The maximum time we are allowing for this to occur, or a signal that will abort the operation
 */
export function entersState(
	target: AudioPlayer,
	status: AudioPlayerStatus,
	timeoutOrSignal: AbortSignal | number,
): Promise<AudioPlayer>;

/**
 * Allows a target a specified amount of time to enter a given state, otherwise rejects with an error.
 *
 * @param target - The object that we want to observe the state change for
 * @param status - The status that the target should be in
 * @param timeoutOrSignal - The maximum time we are allowing for this to occur, or a signal that will abort the operation
 */
export async function entersState<T extends AudioPlayer | VoiceConnection>(
	target: T,
	status: AudioPlayerStatus | VoiceConnectionStatus,
	timeoutOrSignal: AbortSignal | number,
) {
	if (target.state.status !== status) {
		const [ac, signal] =
			typeof timeoutOrSignal === 'number' ? abortAfter(timeoutOrSignal) : [undefined, timeoutOrSignal];
		try {
			await once(target as EventEmitter, status, { signal });
		} finally {
			ac?.abort();
		}
	}

	return target;
}
