import type { VoiceConnection, VoiceConnectionStatus } from '../VoiceConnection';
import type { AudioPlayer, AudioPlayerStatus } from '../audio/AudioPlayer';

/**
 * Allows a voice connection a specified amount of time to enter a given state, otherwise rejects with an error.
 *
 * @param target - The voice connection that we want to observe the state change for
 * @param status - The status that the voice connection should be in
 * @param timeout - The maximum time we are allowing for this to occur
 */
export function entersState(
	target: VoiceConnection,
	status: VoiceConnectionStatus,
	timeout: number,
): Promise<VoiceConnection>;

/**
 * Allows an audio player a specified amount of time to enter a given state, otherwise rejects with an error.
 *
 * @param target - The audio player that we want to observe the state change for
 * @param status - The status that the audio player should be in
 * @param timeout - The maximum time we are allowing for this to occur
 */
export function entersState(target: AudioPlayer, status: AudioPlayerStatus, timeout: number): Promise<AudioPlayer>;

/**
 * Allows a target a specified amount of time to enter a given state, otherwise rejects with an error.
 *
 * @param target - The object that we want to observe the state change for
 * @param status - The status that the target should be in
 * @param timeout - The maximum time we are allowing for this to occur
 */
export async function entersState<T extends VoiceConnection | AudioPlayer>(
	target: T,
	status: VoiceConnectionStatus | AudioPlayerStatus,
	timeout: number,
) {
	if (target.state.status !== status) {
		await new Promise((res, rej) => {
			let timer: NodeJS.Timeout | undefined = undefined;
			function onStateChange() {
				if (timer) clearTimeout(timer);
				return res(void 0);
			}
			(target as AudioPlayer).once(status, onStateChange);
			timer = setTimeout(() => {
				target.removeListener(status, onStateChange);
				rej(new Error("Didn't enter state in time"));
			}, timeout);
		});
	}
	return target;
}
